import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { RedditPost } from './reddit-post.entity';
import { FilterQuery } from './dto';
import { ILike } from 'typeorm';

@Injectable()
export class RedditService {
  constructor(
    @InjectRepository(RedditPost)
    private readonly redditPostRepository: Repository<RedditPost>,
  ) {}

  async fetchAndSavePosts(): Promise<void> {
    console.log('Processing...');
    const token = Buffer.from(
      `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`,
    ).toString('base64');
    const response = await axios.get(
      'https://www.reddit.com/r/singapore/hot.json',
      {
        headers: {
          'User-Agent': process.env.REDDIT_USER_AGENT,
          Authorization: `Basic ${token}`,
        },
      },
    );

    console.log('Response:', response.data);

    const posts = response.data.data.children.map((item) => ({
      title: item.data.title,
      url: item.data.url,
      score: item.data.score,
      comments: item.data.num_comments,
      createdAt: new Date(item.data.created_utc * 1000),
    }));

    await this.redditPostRepository.save(posts);
  }

  async getTrendingPosts(query: FilterQuery): Promise<RedditPost[]> {
    const DEFAULT_DAYS = 7;
    const getDefaultStartDate = (): Date => {
      const date = new Date();
      date.setDate(date.getDate() - DEFAULT_DAYS);
      date.setHours(0, 0, 0, 0);
      return date;
    };

    const getDefaultEndDate = (): Date => {
      const date = new Date();
      date.setHours(23, 59, 59, 999);
      return date;
    };

    const { startDate, endDate, searchQuery, limit } = query;
    const startDateQuery = startDate
      ? new Date(startDate)
      : getDefaultStartDate();
    const endDateQuery = endDate ? new Date(endDate) : getDefaultEndDate();

    const whereClause: any = {
      createdAt: Between(startDateQuery, endDateQuery),
    };

    if (searchQuery) {
      whereClause.title = ILike(`%${searchQuery}%`);
    }

    return this.redditPostRepository.find({
      where: whereClause,
      order: { score: 'DESC' },
      take: limit || 10,
    });
  }
}
