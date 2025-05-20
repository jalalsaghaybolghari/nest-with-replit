import { Controller, UseFilters } from '@nestjs/common';
import { GlobalExceptionFilter } from 'src/infrastructure/filters/global-exception.filter';

@UseFilters(GlobalExceptionFilter)
export class BaseController {}