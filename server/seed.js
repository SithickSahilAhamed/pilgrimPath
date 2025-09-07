const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pilgrimpath');
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create demo users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@pilgrimpath.com',
        password: 'admin123',
        phone: '+91 9876543210',
        role: 'admin',
        language: 'en'
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'user123',
        phone: '+91 9876543211',
        role: 'user',
        language: 'en'
      },
      {
        name: 'राम शर्मा',
        email: 'ram@example.com',
        password: 'user123',
        phone: '+91 9876543212',
        role: 'user',
        language: 'hi'
      },
      {
        name: 'ராஜ் குமார்',
        email: 'raj@example.com',
        password: 'user123',
        phone: '+91 9876543213',
        role: 'user',
        language: 'ta'
      }
    ];

    // Hash passwords and create users
    for (let userData of users) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
      
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${userData.name} (${userData.email})`);
    }

    console.log('\n✅ Demo users created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@pilgrimpath.com / admin123');
    console.log('User: john@example.com / user123');
    console.log('Hindi User: ram@example.com / user123');
    console.log('Tamil User: raj@example.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
