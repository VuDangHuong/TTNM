/** @type {import('next-sitemap').IConfig} */
import axios from 'axios';

const config = {
  siteUrl: 'https://villaflcngocxanh.com',
  generateRobotsTxt: false,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: [
    '/api/*',
    '/admin/*',
    '/_next/*',
    '/404',
    '/500',
    '/checkout',
    '/cart',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    
  ],
  transform: async (config, path) => {
    const priorities = {
      '/': 1.0,
      '/tim-kiem': 0.9,
      '/lien-he': 0.8,
      '/gioi-thieu': 0.8,
      '/bai-viet': 0.8,
    }
  
    const frequencies = {
      '/': 'daily',
      '/tim-kiem': 'daily',
      '/bai-viet': 'daily',
      '/lien-he': 'monthly',
      '/gioi-thieu': 'monthly',
    }
  
    const baseTransform = {
      loc: path,
      changefreq: frequencies[path] || config.changefreq,
      priority: priorities[path] || config.priority,
      lastmod: new Date().toISOString(),
    }
  
    // Trang villa chi tiết
    if (path.startsWith('/villa/')) {
      return {
        ...baseTransform,
        changefreq: 'weekly',
        priority: 0.9,
      }
    }
  
    // Trang blog chi tiết
    if (path.startsWith('/bai-viet/')) {
      return {
        ...baseTransform,
        changefreq: 'weekly',
        priority: 0.8,
      }
    }
  
    return baseTransform;
  },
  additionalPaths: async (config) => {
    const staticPaths = [
      '/', '/tim-kiem', '/bai-viet', '/lien-he', '/gioi-thieu'
    ];
  
    const result = await Promise.all(
      staticPaths.map(path => config.transform(config, path))
    );
    
  
    try {
      // Fetch villas
      const villaResponse = await axios.get('https://api.villaflcngocxanh.com/villas', {
        params: { limit: 1000 }
      });
      const villas = villaResponse.data.villas || [];
      const villaPaths = await Promise.all(
        villas.map(villa => config.transform(config, `/villa/${villa.slug}`))
      );
  
      // Fetch blog posts
      const blogResponse = await axios.get('https://api.villaflcngocxanh.com/posts/visible', {
        params: { limit: 1000 }
      });
      const posts = blogResponse.data.posts || [];
      const blogPaths = await Promise.all(
        posts.map(post => config.transform(config, `/bai-viet/${post.slug}`))
      );
  
      return [...result, ...villaPaths, ...blogPaths];
    } catch (error) {
      console.error('Error fetching data:', error);
      return result;
    }
  }
};

export default config;