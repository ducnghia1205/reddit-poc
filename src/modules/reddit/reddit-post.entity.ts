import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('reddit_posts')
export class RedditPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column()
  score: number;

  @Column()
  comments: number;

  @Column({ type: 'timestamp' })
  createdAt: Date;
}
