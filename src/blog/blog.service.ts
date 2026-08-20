import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId, Types } from 'mongoose';
import { Blog, BlogDocument } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogDocument>,
  ) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async create(createBlogDto: CreateBlogDto, file?: Express.Multer.File) {
    try {
      let content = createBlogDto.content;
      if (typeof content === 'string') {
        try {
          content = JSON.parse(content);
        } catch (e) {}
      }

      const slug = createBlogDto.slug || this.generateSlug(createBlogDto.title);
      let imagePath = file
        ? file.filename || file.originalname
        : typeof createBlogDto.image === 'string'
        ? createBlogDto.image
        : '';

      if (imagePath) {
        imagePath = imagePath
          .replace(/^https?:\/\/[^\/]+\/uploads\//, '')
          .replace(/^\/?uploads\//, '');
      }

      const docToInsert = {
        title: createBlogDto.title,
        slug,
        desc: createBlogDto.desc,
        category: createBlogDto.category,
        readTime: createBlogDto.readTime || '4 min read',
        author: createBlogDto.author || 'HiveRift Team',
        authorRole: createBlogDto.authorRole || 'Tech & Strategy',
        image: imagePath,
        content,
        isPublished: createBlogDto.isPublished !== false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      let blog: any;
      try {
        const res = await this.blogModel.collection.insertOne(docToInsert as any);
        blog = { _id: res.insertedId, ...docToInsert };
      } catch (err: any) {
        blog = await this.blogModel.create(docToInsert);
      }

      return {
        success: true,
        message: 'Blog created successfully',
        data: blog,
      };
    } catch (error: any) {
      console.error('Blog Create Error:', error);
      throw new InternalServerErrorException(
        error?.message || 'Failed to create blog post',
      );
    }
  }

  async findAll(category?: string, search?: string) {
    try {
      const query: any = {};

      if (category && category !== 'All') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { desc: { $regex: search, $options: 'i' } },
        ];
      }

      let blogs: any[] = [];
      try {
        blogs = await this.blogModel.collection
          .find(query)
          .sort({ createdAt: -1 })
          .toArray();
      } catch (e) {
        blogs = await this.blogModel
          .find(query)
          .sort({ createdAt: -1 })
          .exec();
      }

      return {
        success: true,
        count: blogs.length,
        data: blogs,
      };
    } catch (error: any) {
      console.error('Blog FindAll Error:', error);
      throw new InternalServerErrorException('Failed to fetch blogs');
    }
  }

  async findOne(idOrSlug: string) {
    try {
      let blog: any = null;

      if (isValidObjectId(idOrSlug)) {
        try {
          blog = await this.blogModel.collection.findOne({
            _id: new Types.ObjectId(idOrSlug),
          });
        } catch (e) {
          blog = await this.blogModel.findById(idOrSlug).exec();
        }
      }

      if (!blog) {
        blog = await this.blogModel.collection.findOne({ slug: idOrSlug });
      }

      if (!blog) {
        blog = await this.blogModel.findOne({ slug: idOrSlug }).exec();
      }

      if (!blog) {
        throw new NotFoundException(
          `Blog with identifier '${idOrSlug}' not found`,
        );
      }

      return {
        success: true,
        data: blog,
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      console.error('Blog FindOne Error:', error);
      throw new InternalServerErrorException('Failed to fetch blog');
    }
  }

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
    file?: Express.Multer.File,
  ) {
    try {
      let existing: any = null;
      if (isValidObjectId(id)) {
        try {
          existing = await this.blogModel.collection.findOne({
            _id: new Types.ObjectId(id),
          });
        } catch (e) {
          existing = await this.blogModel.findById(id).exec();
        }
      }

      if (!existing) {
        existing = await this.blogModel.collection.findOne({ slug: id });
      }

      if (!existing) {
        return this.create(updateBlogDto as any, file);
      }

      const updateData: any = { ...updateBlogDto, updatedAt: new Date() };

      if (updateData.content && typeof updateData.content === 'string') {
        try {
          updateData.content = JSON.parse(updateData.content);
        } catch (e) {}
      }

      if (updateBlogDto.title && !updateBlogDto.slug) {
        updateData.slug = this.generateSlug(updateBlogDto.title);
      }

      if (file) {
        updateData.image = file.filename || file.originalname;
      } else if (typeof updateData.image === 'string' && updateData.image) {
        updateData.image = updateData.image
          .replace(/^https?:\/\/[^\/]+\/uploads\//, '')
          .replace(/^\/?uploads\//, '');
      } else {
        delete updateData.image;
      }

      await this.blogModel.collection.updateOne(
        { _id: existing._id },
        { $set: updateData },
      );

      return {
        success: true,
        message: 'Blog updated successfully',
        data: { _id: existing._id, ...existing, ...updateData },
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      console.error('Blog Update Error:', error);
      throw new InternalServerErrorException(
        error?.message || 'Failed to update blog',
      );
    }
  }

  async remove(id: string) {
    try {
      if (isValidObjectId(id)) {
        try {
          await this.blogModel.collection.deleteOne({
            _id: new Types.ObjectId(id),
          });
        } catch (e) {
          await this.blogModel.findByIdAndDelete(id).exec();
        }
      } else {
        await this.blogModel.collection.deleteOne({ slug: id });
      }

      return {
        success: true,
        message: 'Blog deleted successfully',
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      console.error('Blog Delete Error:', error);
      throw new InternalServerErrorException(
        error?.message || 'Failed to delete blog',
      );
    }
  }

  async seedDefaultBlogs() {
    try {
      const defaultBlogs = [
        {
          title:
            'Why Your Rs. 5,000 Website Is Costing You More Than You Think',
          slug: 'why-your-rs-5000-website-is-costing-you-more-than-you-think',
          desc: 'Cheap websites may save money upfront, but slow speeds, poor SEO, and security flaws cost you customers daily. Here\'s the real cost of budget web development.',
          category: 'Web Development',
          readTime: '5 min read',
          author: 'HiveRift Team',
          authorRole: 'Tech & Product Strategy',
          image:
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
          content: {
            intro:
              'In today\'s competitive digital landscape, many business owners fall into the trap of purchasing ultra-cheap websites priced at Rs. 3,000 to Rs. 5,000. While it seems like a cost-effective solution initially, unoptimized code, zero mobile responsiveness, and weak security measures end up costing tenfold in lost sales and damaged reputation.',
            keyTakeaways: [
              'Slow load times drop conversion rates by over 40%.',
              'Templated budget sites lack proper SEO schema and security headers.',
              'Custom performance engineering yields 10x long-term ROI.',
              'Scalable architecture prevents frequent site crashes during traffic spikes.',
            ],
            sections: [
              {
                heading: '1. Hidden Costs of Speed & Mobile Performance',
                text: 'Budget websites are often built using heavy, unoptimized page builders that load dozens of unnecessary scripts. Over 65% of users abandon websites that take longer than 3 seconds to load.',
              },
              {
                heading: '2. Zero Search Engine Visibility (SEO)',
                text: 'A website is useless if potential clients cannot find it on Google. Cheap websites lack structured meta tags, semantic HTML tags, and canonical URLs necessary to rank.',
              },
              {
                heading: '3. Security Vulnerabilities & Hacking Risks',
                text: 'Low-cost setup usually means outdated plugins, nulled themes, and no SSL configuration, leaving client data exposed to cyber threats.',
              },
            ],
            quote:
              'If you think good web development is expensive, wait until you see how much a bad one costs your brand.',
            conclusion:
              'Investing in high-performance web engineering ensures your business stands out, converts visitors into paying clients, and scales securely.',
          },
        },
        {
          title: 'Top 7 Digital Marketing Strategies for Indian Businesses in 2026',
          slug: 'top-7-digital-marketing-strategies-for-indian-businesses-in-2026',
          desc: 'Discover actionable strategies to scale your reach, optimize ad spend, and convert traffic into loyal clients in 2026.',
          category: 'Digital Marketing',
          readTime: '6 min read',
          author: 'Growth Lead',
          authorRole: 'Digital Strategy Specialist',
          image:
            'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800',
          content: {
            intro:
              'The digital marketing landscape in India is evolving at breakneck speed. With rising customer acquisition costs and changing consumer behavior, businesses must adopt data-driven omni-channel campaigns.',
            keyTakeaways: [
              'Hyper-targeted Meta & Google Ads yield lower customer acquisition cost (CAC).',
              'Short-form video content drives 3x higher engagement than static posts.',
              'WhatsApp Business API automation streamlines lead nurture funnels.',
              'Local SEO optimization boosts foot traffic for regional services.',
            ],
            sections: [
              {
                heading: '1. AI-Driven Ad Targeting',
                text: 'Modern ad networks rely on machine learning signals. Configuring custom event pixels and conversion APIs helps platforms find high-intent buyers.',
              },
              {
                heading: '2. WhatsApp Automation Funnels',
                text: 'With 95%+ open rates, WhatsApp automation allows businesses to instantly follow up with lead form submissions, improving sales conversion rates.',
              },
            ],
            quote:
              'Marketing is no longer about the stuff that you make, but about the stories you tell and how fast you follow up.',
            conclusion:
              'Implementing these high-converting strategies allows Indian SMBs and enterprises to outpace competitors and maximize marketing ROI.',
          },
        },
        {
          title: 'Practical AI Integration: How Businesses Can Automate Workflows Today',
          slug: 'practical-ai-integration-how-businesses-can-automate-workflows-today',
          desc: 'Learn how to leverage AI tools and custom automation pipelines to save hundreds of hours monthly.',
          category: 'Tech & AI',
          readTime: '4 min read',
          author: 'AI Solutions Architect',
          authorRole: 'Engineering Team',
          image:
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
          content: {
            intro:
              'Artificial Intelligence has transitioned from hype to practical business utility. For Indian businesses, implementing AI isn\'t about replacing human talent—it\'s about automating repetitive operations and delivering hyper-personalized customer experiences.',
            keyTakeaways: [
              'AI-powered customer service chatbots provide 24/7 multilingual support.',
              'Predictive analytics help optimize inventory, supply chains, and lead scoring.',
              'Automated content generation tools assist marketing teams in scaling output.',
              'AI integration must protect user data privacy and security.',
            ],
            sections: [
              {
                heading: '1. Smart Conversational AI Chatbots',
                text: 'Modern AI agents can handle customer support, answer product queries, book appointments, and capture qualified leads in regional Indian languages 24/7.',
              },
              {
                heading: '2. Automated Workflow Integration',
                text: 'Connecting AI modules to your CRM and ERP automates invoice processing, lead tagging, customer follow-up emails, and custom proposal generation.',
              },
              {
                heading: '3. Personalization Engine',
                text: 'AI algorithms analyze user browsing habits to deliver personalized product recommendations, dramatically increasing e-commerce order values.',
              },
            ],
            quote:
              'AI won\'t replace your business, but businesses using AI effectively will replace those that don\'t.',
            conclusion:
              'Leveraging accessible AI solutions today empowers Indian enterprises to operate with speed, agility, and world-class customer support.',
          },
        },
      ];

      const results: any[] = [];
      for (const blogData of defaultBlogs) {
        let blog: any;
        try {
          const existing = await this.blogModel.collection.findOne({
            slug: blogData.slug,
          });
          if (existing) {
            await this.blogModel.collection.updateOne(
              { slug: blogData.slug },
              { $set: blogData },
            );
            blog = { ...existing, ...blogData };
          } else {
            const res = await this.blogModel.collection.insertOne(
              blogData as any,
            );
            blog = { _id: res.insertedId, ...blogData };
          }
        } catch (err: any) {
          blog = await this.blogModel.findOneAndUpdate(
            { slug: blogData.slug },
            blogData,
            { upsert: true, new: true },
          );
        }
        results.push(blog);
      }

      return {
        success: true,
        message: 'Default blogs seeded successfully into database',
        count: results.length,
        data: results,
      };
    } catch (error: any) {
      console.error('Seed Error:', error);
      throw new InternalServerErrorException('Failed to seed default blogs');
    }
  }
}
