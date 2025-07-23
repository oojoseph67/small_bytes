import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  XPHistory,
  XPHistoryDocument,
  XPActivityType,
} from '../entities/xp-history.entity';
import { User, UserDocument } from 'src/user/entities/user.entity';
import {
  GetXPHistoryDto,
  XPHistoryResponseDto,
  UserXPStatsDto,
} from '../dto/xp-history.dto';

@Injectable()
export class XPHistoryService {
  constructor(
    @InjectModel(XPHistory.name)
    private xpHistoryModel: Model<XPHistoryDocument>,
    
    @InjectModel(User.name) 
    private userModel: Model<UserDocument>,
  ) {}

  async getXPHistory(filters?: GetXPHistoryDto) {
    const filter: any = {};

    if (filters?.userId) {
      filter.userId = new Types.ObjectId(filters.userId);
    }

    if (filters?.activityType) {
      filter.activityType = filters.activityType;
    }

    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;

    const history = await this.xpHistoryModel
      .find(filter)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    return history.map((h) => ({
      id: h._id.toString(),
      userId: h.userId.toString(),
      xpChange: h.xpChange,
      previousXP: h.previousXP,
      newXP: h.newXP,
      activityType: h.activityType,
      description: h.description,
      relatedEntityId: h.relatedEntityId?.toString(),
      relatedEntityType: h.relatedEntityType,
      createdAt: h.createdAt.toISOString(),
    }));
  }

  async getUserXPHistory(userId: string, limit?: number, offset?: number) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const history = await this.xpHistoryModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit || 50)
      .skip(offset || 0);

    return history.map((h) => ({
      id: h._id.toString(),
      userId: h.userId.toString(),
      xpChange: h.xpChange,
      previousXP: h.previousXP,
      newXP: h.newXP,
      activityType: h.activityType,
      description: h.description,
      relatedEntityId: h.relatedEntityId?.toString(),
      relatedEntityType: h.relatedEntityType,
      createdAt: h.createdAt.toISOString(),
    }));
  }

  async getUserXPStats(userId: string): Promise<UserXPStatsDto> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get total XP earned
    const totalXPResult = await this.xpHistoryModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$xpChange' } } },
    ]);

    // Get activity counts by type
    const activityCounts = await this.xpHistoryModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $group: { _id: '$activityType', count: { $sum: 1 } } },
    ]);

    // Get certificates earned
    const certificatesEarned =
      activityCounts.find((a) => a._id === XPActivityType.CERTIFICATE_EARNED)
        ?.count || 0;

    // Get courses completed
    const coursesCompleted =
      activityCounts.find((a) => a._id === XPActivityType.COURSE_COMPLETION)
        ?.count || 0;

    // Get total activities
    const totalActivities = activityCounts.reduce((sum, a) => sum + a.count, 0);

    return {
      userId,
      currentXP: user.xp,
      totalXP: totalXPResult[0]?.total || 0,
      totalActivities,
      certificatesEarned,
      coursesCompleted,
    };
  }

  async getXPLeaderboard(limit: number = 10) {
    const leaderboard = await this.userModel
      .find()
      .select('firstName lastName email xp')
      .sort({ xp: -1 })
      .limit(limit);

    return leaderboard.map((user, index) => ({
      rank: index + 1,
      userId: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      xp: user.xp,
    }));
  }

  async getActivityTypeStats(userId: string) {
    const stats = await this.xpHistoryModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$activityType',
          count: { $sum: 1 },
          totalXP: { $sum: '$xpChange' },
        },
      },
      { $sort: { totalXP: -1 } },
    ]);

    return stats.map((stat) => ({
      activityType: stat._id,
      count: stat.count,
      totalXP: stat.totalXP,
    }));
  }

  async getRecentActivity(userId: string, limit: number = 10) {
    const recentActivity = await this.xpHistoryModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('activityType description xpChange createdAt');

    return recentActivity.map((activity) => ({
      activityType: activity.activityType,
      description: activity.description,
      xpChange: activity.xpChange,
      createdAt: activity.createdAt.toISOString(),
    }));
  }

  async getXPHistoryByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const history = await this.xpHistoryModel
      .find({
        userId: new Types.ObjectId(userId),
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName email');

    return history.map((h) => ({
      id: h._id.toString(),
      userId: h.userId.toString(),
      xpChange: h.xpChange,
      previousXP: h.previousXP,
      newXP: h.newXP,
      activityType: h.activityType,
      description: h.description,
      relatedEntityId: h.relatedEntityId?.toString(),
      relatedEntityType: h.relatedEntityType,
      createdAt: h.createdAt.toISOString(),
    }));
  }
}
