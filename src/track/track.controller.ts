import mongoose, { ObjectId } from 'mongoose';
import { TrackService } from './track.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/createTrack.dto';
import { CreateCommentDto } from './dto/createComment.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('/track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post('/create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  create(@UploadedFile() file, @Body() dto: CreateTrackDto) {
    const { picture, audio } = file;
    return this.trackService.create(dto, picture[0], audio[0]);
  }

  @Get('/getAll')
  async getAll(@Query('count') count: number, @Query('offset') offset: number) {
    return this.trackService.getAll(count, offset);
  }

  @Get('/search')
  async search(@Query('query') query: string) {
    return this.trackService.search(query);
  }

  @Get('/getOne/:id')
  getOne(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return this.trackService.getOne(id);
  }

  @Delete('/delete/:id')
  deleteOne(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return this.trackService.deleteOne(id);
  }

  @Post('/create-comment')
  addComment(@Body() dto: CreateCommentDto) {
    return this.trackService.addComment(dto);
  }

  @Post('/listen/:id')
  listen(@Param('id') id: ObjectId) {
    return this.trackService.listen(id);
  }
}
