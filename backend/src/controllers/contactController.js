import emailService from '../services/emailService.js';
import Contact from '../models/Contact.js';

export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message, ip } = req.body;
    
    const result = await emailService.sendContactEmail({
      name,
      email,
      subject,
      message,
      ip
    });
    
    res.json({ success: true, message: result.message });
  } catch (error) {
    console.error('Contact email error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send email. Please try again later.' 
    });
  }
};

// Protected routes (require authentication)
export const getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    
    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Contact.countDocuments(query)
    ]);
    
    res.json({ 
      success: true, 
      data: {
        contacts,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }
    
    // Mark as read if it's new
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }
    
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const updateData = { status };
    if (status === 'replied') {
      updateData.repliedAt = new Date();
    }
    if (notes !== undefined) {
      updateData.notes = notes;
    }
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }
    
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }
    
    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getContactStats = async (req, res) => {
  try {
    const [total, newCount, readCount, repliedCount, archivedCount] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Contact.countDocuments({ status: 'read' }),
      Contact.countDocuments({ status: 'replied' }),
      Contact.countDocuments({ status: 'archived' })
    ]);
    
    res.json({
      success: true,
      data: { total, new: newCount, read: readCount, replied: repliedCount, archived: archivedCount }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
