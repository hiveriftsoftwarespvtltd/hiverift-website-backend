import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { SubmitFrom, SubmitFromDocument } from './entities/sumbitfrom.entity';
import { CreateSubmitFromDto } from './dto/create-sumbitfrom.dto';

@Injectable()
export class SubmitFromService {
  constructor(
    @InjectModel(SubmitFrom.name)
    private readonly submitFromModel: Model<SubmitFromDocument>,
  ) {}

  async create(dto: CreateSubmitFromDto, file?: Express.Multer.File) {
    try {
      const docToInsert = {
        fullName: dto.fullName || 'N/A',
        email: dto.email || 'N/A',
        phone: dto.phone || 'N/A',
        position: dto.position || 'N/A',
        portfolio: dto.portfolio || '',
        coverLetter: dto.coverLetter || '',
        resume: file ? file.originalname : '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      let savedData: any;
      try {
        const res = await this.submitFromModel.collection.insertOne(docToInsert as any);
        savedData = { _id: res.insertedId, ...docToInsert };
        console.log('✅ Job Application saved to MongoDB:', savedData._id);
      } catch (e: any) {
        savedData = await this.submitFromModel.create(docToInsert);
        console.log('✅ Job Application saved to MongoDB via Mongoose:', savedData._id);
      }

      try {
        await this.sendJobApplicationEmail(savedData, file);
      } catch (emailErr: any) {
        console.error('❌ SMTP Email Send Failed:', emailErr?.message || emailErr);
      }

      return {
        success: true,
        message: 'Application submitted successfully',
        data: savedData,
      };
    } catch (error: any) {
      console.error('Job Application Error:', error);
      throw new InternalServerErrorException(
        error?.message || 'Application submission failed',
      );
    }
  }

  async createContactInquiry(dto: any) {
    try {
      const docToInsert = {
        name: dto.name || dto.fullName || 'N/A',
        email: dto.email || 'N/A',
        phone: dto.phone || 'N/A',
        company: dto.company || 'N/A',
        service: dto.service || 'General Inquiry',
        message: dto.message || dto.details || 'N/A',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      let savedData: any;
      try {
        const res = await this.submitFromModel.collection.insertOne(docToInsert as any);
        savedData = { _id: res.insertedId, ...docToInsert };
        console.log('✅ Contact Inquiry saved to MongoDB:', savedData._id);
      } catch (e: any) {
        savedData = await this.submitFromModel.create(docToInsert as any);
        console.log('✅ Contact Inquiry saved to MongoDB via Mongoose:', savedData._id);
      }

      try {
        await this.sendContactEmail(savedData);
      } catch (emailErr: any) {
        console.error('❌ SMTP Email Send Failed:', emailErr?.message || emailErr);
      }

      return {
        success: true,
        message: 'Contact inquiry submitted successfully',
        data: savedData,
      };
    } catch (error: any) {
      console.error('Contact Inquiry Error:', error);
      throw new InternalServerErrorException(
        error?.message || 'Contact inquiry submission failed',
      );
    }
  }

  private async sendJobApplicationEmail(data: any, file?: Express.Multer.File) {
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || 'ravinder@hiverift.com';
    const mailUser = process.env.MAIL_USER;
    const mailPass = process.env.MAIL_PASS;

    if (!mailUser || !mailPass) {
      console.warn('⚠️ Mail credentials (MAIL_USER/MAIL_PASS) missing in .env');
      return;
    }

    console.log(`📧 Attempting to send Job Application email to ${receiverEmail}...`);

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.MAIL_PORT) || 587,
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });

    const attachments: any[] = [];
    if (file) {
      attachments.push({
        filename: file.originalname,
        content: file.buffer,
      });
    }

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || `HiveRift Careers <${mailUser}>`,
      to: receiverEmail,
      subject: `New Job Application: ${data.position} - ${data.fullName}`,
      attachments: attachments,
      html: `
        <div style="background:#f4f6f8; padding:30px; font-family: Arial, Helvetica, sans-serif;">
          <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="background:#059669; padding:20px 25px;">
              <h2 style="margin:0; color:#ffffff; font-size:20px;">
                New Job Application Received
              </h2>
              <p style="margin:4px 0 0; color:#d1fae5; font-size:13px;">
                Position: ${data.position}
              </p>
            </div>

            <!-- Body -->
            <div style="padding:25px;">
              <table style="width:100%; border-collapse:collapse; font-size:14px;">
                <tr>
                  <td style="padding:10px; font-weight:600; color:#555; width:30%;">Full Name</td>
                  <td style="padding:10px;">${data.fullName}</td>
                </tr>
                <tr style="background:#f9fafb;">
                  <td style="padding:10px; font-weight:600; color:#555;">Email</td>
                  <td style="padding:10px;"><a href="mailto:${data.email}">${data.email}</a></td>
                </tr>
                <tr>
                  <td style="padding:10px; font-weight:600; color:#555;">Phone</td>
                  <td style="padding:10px;"><a href="tel:${data.phone}">${data.phone}</a></td>
                </tr>
                <tr style="background:#f9fafb;">
                  <td style="padding:10px; font-weight:600; color:#555;">Portfolio</td>
                  <td style="padding:10px;">${data.portfolio || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding:10px; font-weight:600; color:#555;">Resume</td>
                  <td style="padding:10px;">
                    <span style="color:#059669; font-weight:600;">${file ? 'Attached to this email' : 'No attachment'}</span>
                  </td>
                </tr>
              </table>

              <div style="margin-top:20px;">
                <p style="margin:0 0 6px; font-weight:600; color:#555;">
                  Cover Letter
                </p>
                <div style="background:#f8fafc; padding:12px; border-radius:6px; border-left: 4px solid #059669;">
                  ${String(data.coverLetter || '').replace(/\n/g, '<br>')}
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="background:#f1f5f9; padding:15px; text-align:center;">
              <p style="margin:0; font-size:12px; color:#666;">
                This application was submitted via HiveRift website careers portal.
              </p>
            </div>

          </div>
        </div>
      `,
    });

    console.log('🎉 Email sent successfully! MessageId:', info.messageId);
  }

  private async sendContactEmail(data: any) {
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || 'ravinder@hiverift.com';
    const mailUser = process.env.MAIL_USER;
    const mailPass = process.env.MAIL_PASS;

    if (!mailUser || !mailPass) {
      console.warn('⚠️ Mail credentials (MAIL_USER/MAIL_PASS) missing in .env');
      return;
    }

    console.log(`📧 Attempting to send Contact Inquiry email to ${receiverEmail}...`);

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.MAIL_PORT) || 587,
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || `HiveRift Website <${mailUser}>`,
      to: receiverEmail,
      subject: `New Website Contact Inquiry: ${data.name} - ${data.service}`,
      html: `
        <div style="background:#f4f6f8; padding:30px; font-family: Arial, Helvetica, sans-serif;">
          <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="background:#059669; padding:20px 25px;">
              <h2 style="margin:0; color:#ffffff; font-size:20px;">
                New Website Contact Inquiry
              </h2>
              <p style="margin:4px 0 0; color:#d1fae5; font-size:13px;">
                Service Requested: ${data.service}
              </p>
            </div>

            <!-- Body -->
            <div style="padding:25px;">
              <table style="width:100%; border-collapse:collapse; font-size:14px;">
                <tr>
                  <td style="padding:10px; font-weight:600; color:#555; width:30%;">Client Name</td>
                  <td style="padding:10px;">${data.name}</td>
                </tr>
                <tr style="background:#f9fafb;">
                  <td style="padding:10px; font-weight:600; color:#555;">Email</td>
                  <td style="padding:10px;"><a href="mailto:${data.email}">${data.email}</a></td>
                </tr>
                <tr>
                  <td style="padding:10px; font-weight:600; color:#555;">Phone</td>
                  <td style="padding:10px;"><a href="tel:${data.phone}">${data.phone}</a></td>
                </tr>
                <tr style="background:#f9fafb;">
                  <td style="padding:10px; font-weight:600; color:#555;">Company</td>
                  <td style="padding:10px;">${data.company}</td>
                </tr>
                <tr>
                  <td style="padding:10px; font-weight:600; color:#555;">Service Needed</td>
                  <td style="padding:10px;">${data.service}</td>
                </tr>
              </table>

              <div style="margin-top:20px;">
                <p style="margin:0 0 6px; font-weight:600; color:#555;">
                  Message / Project Details
                </p>
                <div style="background:#f8fafc; padding:12px; border-radius:6px; border-left: 4px solid #059669;">
                  ${String(data.message).replace(/\n/g, '<br>')}
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="background:#f1f5f9; padding:15px; text-align:center;">
              <p style="margin:0; font-size:12px; color:#666;">
                This inquiry was submitted via HiveRift website contact form.
              </p>
            </div>

          </div>
        </div>
      `,
    });

    console.log('🎉 Email sent successfully! MessageId:', info.messageId);
  }

  async findAll() {
    try {
      let items: any[] = [];
      try {
        items = await this.submitFromModel.find().sort({ createdAt: -1, _id: -1 }).exec();
      } catch (err) {
        items = await this.submitFromModel.collection.find({}).sort({ _id: -1 }).toArray();
      }
      return {
        success: true,
        count: items.length,
        data: items,
      };
    } catch (error: any) {
      console.error('Fetch Submissions Error:', error);
      throw new InternalServerErrorException(
        error?.message || 'Failed to fetch submissions',
      );
    }
  }

  async remove(id: string) {
    try {
      await this.submitFromModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Submission deleted successfully',
      };
    } catch (error: any) {
      console.error('Delete Submission Error:', error);
      throw new InternalServerErrorException(
        error?.message || 'Failed to delete submission',
      );
    }
  }

  async updateStatus(id: string, status: string) {
    try {
      let updated: any;
      try {
        updated = await this.submitFromModel.findByIdAndUpdate(
          id,
          { status, updatedAt: new Date() },
          { new: true },
        );
      } catch (err) {
        const { ObjectId } = require('mongodb');
        const res = await this.submitFromModel.collection.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { status, updatedAt: new Date() } },
          { returnDocument: 'after' },
        );
        updated = (res as any)?.value || res;
      }

      return {
        success: true,
        message: 'Status updated successfully',
        data: updated,
      };
    } catch (error: any) {
      console.error('Update Status Error:', error);
      throw new InternalServerErrorException(
        error?.message || 'Failed to update status',
      );
    }
  }
}
