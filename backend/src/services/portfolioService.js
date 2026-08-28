import Portfolio from '../models/Portfolio.js';

class PortfolioService {
  async getPortfolio() {
    try {
      let portfolio = await Portfolio.findOne();
      
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
      await Portfolio.deleteMany({});
      const portfolio = await Portfolio.create(defaultPortfolioData);
      return portfolio;
    } catch (error) {
      console.error('Reset portfolio error:', error);
      throw new Error(`Failed to reset portfolio: ${error.message}`);
    }
  }

  async addGalleryImage(imageUrl) {
    try {
      let portfolio = await Portfolio.findOne();
      if (!portfolio) {
        const { defaultPortfolioData } = await import('../../seed/defaultData.js');
        portfolio = await Portfolio.create(defaultPortfolioData);
      }

      const newImage = {
        id: Date.now(),
        url: imageUrl,
        alt: 'Profile image',
        order: portfolio.galleryImages?.length || 0
      };

      portfolio.galleryImages.push(newImage);
      await portfolio.save();
      
      return portfolio;
    } catch (error) {
      console.error('Add gallery image error:', error);
      throw new Error(`Failed to add gallery image: ${error.message}`);
    }
  }

  async removeGalleryImage(imageId) {
    try {
      let portfolio = await Portfolio.findOne();
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      portfolio.galleryImages = portfolio.galleryImages.filter(img => img.id !== imageId);
      await portfolio.save();
      
      return portfolio;
    } catch (error) {
      console.error('Remove gallery image error:', error);
      throw new Error(`Failed to remove gallery image: ${error.message}`);
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
        totalGalleryImages: portfolio.galleryImages?.length || 0,
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
