import { Component, AfterViewInit, ViewChild, ElementRef, TemplateRef, ViewContainerRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Boards } from '../../models/boards.model';
import { BoardsService } from '../../services/boards.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // <-- Import FormsModule here

import { RemovePrefixPipe } from '../../pipes/remove-prefix.pipe';

declare var bootstrap: any; // Ensure Bootstrap JS is available

@Component({
  selector: 'app-selectedboard',
  imports: [CommonModule, RemovePrefixPipe, FormsModule],
  providers: [RemovePrefixPipe],
  templateUrl: './selectedboard.component.html',
  styleUrl: './selectedboard.component.scss'
})
export class SelectedboardComponent implements AfterViewInit {
  // @ViewChild('tooltipLink', { static: true }) tooltipLink!: ElementRef;
  // @ViewChild('tooltipElement', { static: true }) tooltipElement!: TemplateRef<any>;

  //#region1
  jenkins_project_name: any = [];
  boot_test_result: any = [];
  source_adjacency_matrix: any = [];
  hdl_hash: any = [];
  linux_hash: any = [];
  jenkins_build_number: number = 0;
  boot_folder_name: any = [];
  jenkins_job_date: Date = new Date();
  jenkins_trigger: string = '';
  hash: any;
  trigger = '';
  linux_prompt_reached: boolean = true;
  uboot_reached: boolean = true;
  dmesg_errors_found: string = '';
  dmesg_warnings_found: string = '';
  drivers_enumerated: string = '';
  drivers_missing: string = '';
  last_failing_stage: any;
  last_failing_stage_failure: any;
  matlab_errors: string = '';
  matlab_failures: string = '';
  matlab_skipped: string = '';
  matlab_tests: string = '';
  pytest_errors: string = '';
  pytest_failures: string = '';
  pytest_skipped: string = '';
  pytest_tests: string = '';
  pyadi_tests_url: string = '';
  trigger_url: string = '';
  dataAggregates: any[] = [];

  //#endregion1

  //#region2
  selectedBoard: string = '';
  selectedBoardDetails: any[] = [];  // Stores all filtered entries
  displayedHistory: any[] = []; // Stores only current page entries
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchText: string = '';  // Search query for filtering
  selectedBranch: string = 'boot_partition_main'; // Default selection
  availableBranches: string[] = [];
  filteredBoardDetails: any[] = [];

  //#endregion2

  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2
  ) { }

  ngAfterViewInit() {
  //   if (!this.tooltipLink || !this.tooltipElement) {
  //     console.error('Tooltip link or template not found!');
  //     return;
  //   }

  //   new bootstrap.Tooltip(this.tooltipLink.nativeElement, {
  //     title: () => this.getTooltipContent(),
  //     html: true,
  //     placement: 'top'
  //   });
  // }

  // getTooltipContent(): string {
  //   // Create a temporary container to hold the template content
  //   const tempContainer = this.renderer.createElement('div');

  //   // Render the ng-template inside an embedded view
  //   const embeddedView = this.tooltipElement.createEmbeddedView({});
  //   embeddedView.rootNodes.forEach(node => tempContainer.appendChild(node.cloneNode(true)));

  //   return tempContainer.innerHTML; // Extract only the inner HTML without inserting into the DOM
   }

  ngOnInit() {
    this.selectedBoard = this.route.snapshot.params['boardName'] || '';
    console.log('Selected Board:', this.selectedBoard);
    this.fetchBoardDetails();
    this.populateAvailableBranches();


  }
  fetchBoardDetails() {
    this.boardsService.getBoardDetails(this.selectedBoard).subscribe((boards: any[]) => {
      // Filter only entries that match the selected board name
      this.selectedBoardDetails = boards.filter((b: any) => b.boot_folder_name === this.selectedBoard);

      this.updateDisplayedHistory();
    });
  }
  filterResults() {
    this.filteredBoardDetails = this.dataAggregates.filter(board =>
      (board.source_adjacency_matrix === this.selectedBranch) &&
      (this.searchText === '' || 
        board.jenkins_project_name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        board.boot_folder_name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        board.hdl_hash?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        board.linux_hash?.toLowerCase().includes(this.searchText.toLowerCase()))
    );
  }
  populateAvailableBranches() {
    this.availableBranches = Array.from(
      new Set(this.dataAggregates.map(board => board.source_adjacency_matrix))
    );
  
    if (!this.availableBranches.includes('boot_partition_main')) {
      this.availableBranches.unshift('boot_partition_main');
    }
  
    this.filterResults();
  }

  updateDisplayedHistory() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedHistory = this.selectedBoardDetails.slice(startIndex, endIndex);
  }

  changePage(newPage: number | string) {
    if (typeof newPage === 'number' && newPage >= 1 && newPage <= this.getTotalPages()) {
      this.currentPage = newPage;
      this.updateDisplayedHistory();
    }
  }


  getTotalPages(): number {
    return Math.ceil(this.selectedBoardDetails.length / this.itemsPerPage);
  }

  getPaginationRange(): (number | string)[] {
    const total = this.getTotalPages();
    const maxVisible = 5; // Show first 5 pages before "...lastPage"

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (this.currentPage <= maxVisible - 2) {
      return [...Array.from({ length: maxVisible }, (_, i) => i + 1), '...', total];
    }

    if (this.currentPage >= total - 2) {
      return [1, '...', ...Array.from({ length: maxVisible }, (_, i) => total - maxVisible + i + 1)];
    }

    return [1, '...', this.currentPage - 1, this.currentPage, this.currentPage + 1, '...', total];
  }

}






