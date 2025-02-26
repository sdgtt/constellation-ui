import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removePrefix',
  pure: false
})
export class RemovePrefixPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }

    const prefixes = [
      'Triggers/multi_config_trigger_bp_',
      'HW_tests/HW_test_multiconfig',
      'multi_config_trigger/',
      'auto:multi_config_trigger/'
    ];

    for (const prefix of prefixes) {
      value = value.replace(prefix, ' ');

    }
    return value.trim();

  }
}
