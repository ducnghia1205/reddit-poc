import { Controller, Get, Query } from '@nestjs/common';
import { RedditService } from './reddit.service';
import { FilterQuery } from './dto';

@Controller('reddit')
export class RedditController {
  constructor(private readonly redditService: RedditService) {}

  @Get('fetch')
  async fetchPosts(): Promise<{ message: string }> {
    await this.redditService.fetchAndSavePosts();
    return { message: 'Posts fetched and saved successfully!' };
  }

  @Get('trending')
  async getTrendingPosts(@Query() query: FilterQuery) {
    return this.redditService.getTrendingPosts(query);
  }
}
