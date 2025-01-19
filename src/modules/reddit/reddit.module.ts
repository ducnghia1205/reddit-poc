import { Module } from '@nestjs/common';
import { RedditService } from './reddit.service';
import { RedditController } from './reddit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedditPost } from './reddit-post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RedditPost])],
  providers: [RedditService],
  controllers: [RedditController],
})
export class RedditModule {}
