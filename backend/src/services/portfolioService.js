// src/services/portfolioService.js (corrected from porfolioService.js)
import Portfolio from '../models/Portfolio.js';

class PortfolioService {
  async getPortfolio() {
    try {
      let portfolio = await Portfolio.findOne();
      
      // If no portfolio exists, create one with default data
      if (!portfolio) {
        const { defaultPortfolioData } = await import('../../seed/defaultData.js');
        portfolio = await Portfolio.create(defaultPortfolioData);
      }
      
      return portfolio;
    } catch (error) {
      console.error('Get portfolio error:', error);
      throw new Error(`Failed to fetch portfolio: ${error.message}`);
    }
  }

  async updatePortfolio(updateData) {
    try {
      let portfolio = await Portfolio.findOne();
      
      if (!portfolio) {
        const { defaultPortfolioData } = await import('../../seed/defaultData.js');
        portfolio = await Portfolio.create(defaultPortfolioData);
      }
      
      // Update portfolio with new data
      const updatedPortfolio = await Portfolio.findByIdAndUpdate(
        portfolio._id,
        {
          ...updateData,
          lastUpdated: new Date()
        },
        { new: true, runValidators: true }
      );
      
      return updatedPortfolio;
    } catch (error) {
      console.error('Update portfolio error:', error);
      throw new Error(`Failed to update portfolio: ${error.message}`);
    }
  }

  async resetToDefault() {
    try {
      const { defaultPortfolioData } = await import('../../seed/defaultData.js');
      
      // Delete existing portfolio
      await Portfolio.deleteMany({});
      
      // Create new with default data
      const portfolio = await Portfolio.create(defaultPortfolioData);
      
      return portfolio;
    } catch (error) {
      console.error('Reset portfolio error:', error);
      throw new Error(`Failed to reset portfolio: ${error.message}`);
    }
  }

  async getPortfolioStats() {
    try {
      const portfolio = await Portfolio.findOne();
      if (!portfolio) return null;
      
      return {
        totalProjects: portfolio.projects.length,
        totalExperience: portfolio.experience.length,
        totalBlogs: portfolio.blog.length,
        totalSkills: portfolio.skills.length,
        totalServices: portfolio.services.length,
        lastUpdated: portfolio.lastUpdated,
        createdAt: portfolio.createdAt
      };
    } catch (error) {
      console.error('Get stats error:', error);
      throw new Error(`Failed to fetch stats: ${error.message}`);
    }
  }
}

export default new PortfolioService();
