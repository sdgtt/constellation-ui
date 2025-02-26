import { Component, AfterViewInit, ViewChild, ElementRef, TemplateRef, ViewContainerRef, Renderer2 } from '@angular/core';
import { CommonModule} from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // <-- Import FormsModule here

import { Boards } from '../../models/boards.model';
import { BoardsService } from '../../services/boards.service';

declare var bootstrap: any; // Ensure Bootstrap JS is available

@Component({
  selector: 'app-kuiperlinuxci',
  imports: [CommonModule,FormsModule],
  templateUrl: './kuiperlinuxci.component.html',
  styleUrl: './kuiperlinuxci.component.scss'
})
export class KuiperlinuxciComponent implements AfterViewInit {
  @ViewChild('tooltipLink', { static: true }) tooltipLink!: ElementRef;
  @ViewChild('tooltipElement', { static: true }) tooltipElement!: TemplateRef<any>;

  private tooltipInstance: any;

  //#region 
  kuiperlinuxci = "Kuiper Linux CI is a CI for continuous testing of Kuiper Linux on hardware. It is automatically triggered once a new boot partition is built and uploaded to artifactory.\n page shows the latest test results summary of Kuiper Linux test stages.";

  boards: Boards = new Boards();
  jenkins_project_name: any;
  source_adjacency_matrix: any;
  hdl_hash: any;
  linux_hash: any;
  jenkins_build_number: number = 0;
  boot_folder_name: any = [];
  jenkins_job_date: Date = new Date();
  hash: any;
  linux_prompt_reached: boolean = true;
  uboot_reached: boolean = true;
  dmesg_errors_found: number = 0;
  dmesg_warnings_found: number = 0;
  drivers_enumerated: number = 0;
  drivers_missing: number = 0;
  last_failing_stage: any;
  last_failing_stage_failure: any;
  matlab_errors: number = 0;
  matlab_failures: number = 0;
  matlab_skipped: number = 0;
  matlab_tests: number = 0;
  pytest_errors: number = 0;
  pytest_failures: number = 0;
  pytest_skipped: number = 0;
  pytest_tests: number = 0;
  currentLatestBuildNumber: number = 0;
  passingBoardsCount: number = 0;
  onlineBoardsCount: number = 0;
  linuxBoardsCount: number = 0;
  pytestBoardsCount: number = 0;
  dataAggregates: any[] = [];
  latestData: any = {};
  boardDetail: any[] = [];
  pstatusIcon: string[] = ['/Online.png', '/Offline.png'];
  bstatusIcon: string[] = ['/Passed.png', '/nebula.svg', '/linux.svg', '/python.svg'];
  sortOrder: 'asc' | 'desc' = 'desc'; // Initialize the sorting order
  statusMessages: string[] = [];
  status: string[] = [];
  icon: string[] = [];
  searchText: string = '';  // Search query for filtering
  //#endregion

  constructor(
    private boardsService: BoardsService,
    private router: Router, 
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2) { }

    ngAfterViewInit() {
      if (!this.tooltipLink || !this.tooltipElement) {
        console.error('Tooltip link or template not found!');
        return;
      }
  
      // Initialize the tooltip
      this.tooltipInstance = new bootstrap.Tooltip(this.tooltipLink.nativeElement, {
        title: 'Loading...', // Temporary placeholder
        html: true,
        placement: 'top',
        trigger: 'focus',
      });
  
      // Update the tooltip content dynamically
      setTimeout(() => {
        if (this.tooltipInstance) {
          this.tooltipInstance.dispose(); // Destroy old tooltip
          this.tooltipInstance = new bootstrap.Tooltip(this.tooltipLink.nativeElement, {
            title: this.getTooltipContent(),
            html: true,
            placement: 'top',
            trigger: 'focus',
          });
        }
      }, 100); // Small delay to ensure correct rendering
    }
  
    getTooltipContent(): string {
      // Create a temporary container to hold the template content
      const tempContainer = this.renderer.createElement('div');
  
      // Render the ng-template inside an embedded view
      const embeddedView = this.tooltipElement.createEmbeddedView({});
      embeddedView.rootNodes.forEach(node => tempContainer.appendChild(node.cloneNode(true)));
  
      return tempContainer.innerHTML; // Extract only the inner HTML without inserting into the DOM
    }
  ngOnInit(): void {
    this.fetchDataAggregates();

  }

  fetchDataAggregates() {
    this.boardsService.getDataAggregates().subscribe((aggregatesTop: any[]) => {
      this.dataAggregates = aggregatesTop.map(aggr => aggr[Object.keys(aggr)[0]]);
      this.boardDetail = [...this.dataAggregates]; 
      const latest = this.dataAggregates.reduce((latestData, bd) => {
        if (!latestData.jenkins_job_date || bd.jenkins_job_date > latestData.jenkins_job_date) {
          latestData.jenkins_job_date = bd.jenkins_job_date;
          latestData.jenkins_project_name = bd.jenkins_project_name;
          latestData.boot_folder_name = bd.boot_folder_name;
          latestData.jenkins_build_number = bd.jenkins_build_number;
          latestData.source_adjacency_matrix = bd.source_adjacency_matrix;
          latestData.hdl_hash = this.removeNextText(bd.hdl_hash);
          latestData.linux_hash = this.removeNextText(bd.linux_hash);
        }
        return latestData;
      }, {} as any);

      this.latestData = latest;
      this.onlineBoardsCount = this.countOnlineBoards(this.dataAggregates);
      this.passingBoardsCount = this.countPassingBoards(this.dataAggregates);
      this.linuxBoardsCount = this.countLinuxErrors(this.dataAggregates);
      this.pytestBoardsCount = this.countPytestErrors(this.dataAggregates);
    });
  }

  filterResults(text: string) {
    if (!text) {
      // Reset the boardDetail to the original data
      this.boardDetail = [...this.dataAggregates];
      return;
    }
     // Perform filtering logic
     this.boardDetail = this.dataAggregates.filter((item) => {
      return (
        item.jenkins_project_name?.toLowerCase().includes(text.toLowerCase()) ||
        item.boot_folder_name?.toLowerCase().includes(text.toLowerCase()) ||
        item.jenkins_build_number?.toLowerCase().includes(text.toLowerCase()) ||
        item.source_adjacency_matrix?.toLowerCase().includes(text.toLowerCase()) ||
        item.hdl_hash?.toLowerCase().includes(text.toLowerCase()) ||
        item.linux_hash?.toLowerCase().includes(text.toLowerCase())
      );
    });
  }
  
  removeNextText(h: string): string {
    this.hash = h.split(' ');
    if (this.hash.length > 0) {
      var firstText = this.hash[0];
      return firstText;
    }
    else {
      return '';
    }
  }
  sortDataAggregates() {
    this.boardDetail.sort((a, b) => {
      const dateA = new Date(a.jenkins_job_date).getTime();
      const dateB = new Date(b.jenkins_job_date).getTime();

      const sortOrderMultiplier = this.sortOrder === 'asc' ? 1 : -1;
      return sortOrderMultiplier * (dateB - dateA);
    });
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortDataAggregates();
  }

  isBoardOnline(bd: any): { status: string, icon: string } {

    if (bd.uboot_reached && bd.linux_prompt_reached) {
      return {
        status: `Online`,
        icon: this.pstatusIcon[0]
      };
    }
    else {
      return {
        status: `Offline`,
        icon: this.pstatusIcon[1]
      };
    }

  }

  isBoardPassed(bd: any): string[] {

    const statusMessages: string[] = [];
    const status: string[] = [];
    const icon: string[] = [];

    if (bd.drivers_enumerated != 0 &&
      bd.dmesg_errors_found == 0 &&
      bd.drivers_missing == 0 &&
      bd.pytest_errors == 0 &&
      bd.pytest_failures == 0) {
      statusMessages.push(`No errors encountered`);
      status.push(`pass`);
      icon.push(this.bstatusIcon[0]); // Push icon to the array
    }

    if (bd.drivers_enumerated == 0) {
      statusMessages.push(`Drivers enumerated: ${bd.drivers_enumerated}`);
      status.push(`linux`);
      icon.push(this.bstatusIcon[2]);
    }

    if (bd.drivers_missing != 0) {
      statusMessages.push(`Drivers missing: ${bd.drivers_missing}`);
      status.push(`linux`);
      icon.push(this.bstatusIcon[2]);
    }
    if (bd.dmesg_errors_found != 0) {
      statusMessages.push(`Linux dmesg error/s: ${bd.dmesg_errors_found}`);
      status.push(`linux`);
      icon.push(this.bstatusIcon[2]);
    }
    if (bd.pytest_errors != 0) {
      statusMessages.push(`Pytest error/s: ${bd.pytest_errors}`);
      status.push(`pytest`);
      icon.push(this.bstatusIcon[3]);
    }
    if (bd.pytest_failures != 0) {
      statusMessages.push(`Pytest failure/s: ${bd.pytest_failures}`);
      status.push(`pytest`);
      icon.push(this.bstatusIcon[3]);
    }
    if (bd.last_failing_stage_failure != "NA") {
      statusMessages.push(`Failing stage: ${bd.last_failing_stage_failure}`);
      status.push(`nebula`);
      icon.push(this.bstatusIcon[1]);
    }

    if (!bd.linux_prompt_reached) {
      statusMessages.push(`Linux prompt not reached`);
      status.push(`nebula`);
      //this.icon = this.imagePath + this.bstatusIcon[1];
    }

    if (!bd.uboot_reached) {
      statusMessages.push(`U-boot prompt not reached`);
      status.push(`nebula`);
      //this.icon = this.imagePath + this.bstatusIcon[1];
    }

    if (statusMessages.length == 1 || status.length == 1 || icon.length == 1) {
      this.statusMessages = statusMessages;
      this.status = status;
      this.icon = icon;
    }

    else if (statusMessages.length > 1) {
      this.statusMessages = ['\u2022 ' + statusMessages.join('<br>\u2022 ')];
      this.icon = icon; // Join icons with a comma if there are two or more
      this.status = [status.join(', ')]; // Join icons with a comma if there are two or more
    }

    bd.status = this.status;
    bd.statusMessages = this.statusMessages;
    bd.icon = this.icon;
    // console.log(bd.boot_folder_name, bd.statusMessages);

    return bd.icon;

  }

  countPassingBoards(dataAggregates: any[]): number {
    let passingBoards = 0;

    for (const bd of dataAggregates) {
      this.isBoardPassed(bd); // Call isBoardPassed to calculate the board's status

      // Check if the status array contains 'pass'
      if (bd.status && bd.status.includes(`pass`)) {
        passingBoards++;
        // console.log( "Pass " + passingBoards +" - " + bd.boot_folder_name);

      }
    }

    return passingBoards;
  }

  countLinuxErrors(dataAggregates: any[]): number {
    let linuxBoards = 0;
    let boardL = '';

    for (const bd of dataAggregates) {
      this.isBoardPassed(bd); // Call isBoardPassed to calculate the board's status

      // Check if the status array contains 'pass'
      if (bd.drivers_missing != 0 || bd.dmesg_errors_found != 0 || bd.drivers_enumerated == 0) {
        linuxBoards++;
        boardL = bd.boot_folder_name;
        console.log("Linux " + linuxBoards + " - " + boardL);

      }
    }

    return linuxBoards;
  }

  countPytestErrors(dataAggregates: any[]): number {
    let pytestBoards = 0;

    for (const bd of dataAggregates) {
      this.isBoardPassed(bd); // Call isBoardPassed to calculate the board's status

      // Check if the status array contains 'pass'
      if (bd.pytest_errors != 0 || bd.pytest_failures != 0) {
        pytestBoards++;
        // console.log("Pytest " + pytestBoards +" - " +bd.boot_folder_name);

      }

    }

    return pytestBoards;
  }

  countOnlineBoards(dataAggregates: any[]): number {

    for (const bd of dataAggregates) {
      const boardOnline = this.isBoardOnline(bd);

      if (boardOnline.status == 'Online') {
        this.onlineBoardsCount++;
      }
    }
    return this.onlineBoardsCount++;
  }

  navigateToSelectedBoardPage(boardName: string) {
    console.log(`Navigating to /selectedboard/${boardName}`);
    this.router.navigate(['/selectedboard', boardName]);
  }
}
