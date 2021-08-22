import { Pipe, PipeTransform } from '@angular/core';

// capitalize username

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(value?: string, ...args: unknown[]): unknown {
    return value ? value[0].toUpperCase() + value.slice(1) : value
  }

}
