export type BlogPost = {
    id: string;
    title: string;
    date: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
};

export const blogPosts: BlogPost[] = [
    {
        id: '1',
        title: 'The Transformative Power of Educational Travel: A Journey Beyond Borders',
        date: 'November 15, 2025',
        excerpt: 'Explore how stepping out of your comfort zone and immersing yourself in new cultures can shape your future and broaden your perspective.',
        content: `
      <p class="lead">Educational travel is more than just visiting new places; it's about immersing yourself in different cultures, understanding global perspectives, and discovering your own potential. In this article, we explore the profound impact of learning while traveling.</p>
      
      <h3>Expanding Horizons</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <p>Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque.</p>
      
      <h3>Building Global Connections</h3>
      <p>Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat. Curabitur augue lorem, dapibus quis, laoreet et, pretium ac, nisi. Aenean magna nisl, mollis quis, molestie eu, feugiat in, orci. In hac habitasse platea dictumst. Fusce convallis, mauris imperdiet gravida bibendum, nisl turpis suscipit mauris, sed placerat ipsum urna sed risus. In convallis tellus a mauris. Curabitur ordi. In hac habitasse platea dictumst.</p>
      <p>Suspendisse potenti. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, fermentum et, dapibus sed, urna. Morbi interdum mollis sapien. Sed ac risus. Phasellus lacinia, magna a ullamcorper laoreet, lectus arcu pulvinar risus, vitae facilisis libero dolor a purus. Sed vel lacus. Mauris nibh felis, adipiscing varius, adipiscing in, lacinia vel, tellus.</p>
      
      <h3>Conclusion</h3>
      <p>In conclusion, the journey of educational travel is one of self-discovery and global understanding. Whether it's mastering a new language, understanding a complex historical context, or simply making a friend from a different background, the lessons learned on the road are invaluable. We invite you to join us on this incredible journey and see the world through a new lens.</p>
    `,
        image: 'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2064&auto=format&fit=crop',
        author: 'Elena Rodriguez'
    },
    {
        id: '2',
        title: 'Why Study Abroad in High School?',
        date: 'Sep 28, 2025',
        excerpt: 'Studying abroad isn\'t just for university students. Learn why starting early gives you a competitive edge.',
        content: `
      <p>High school is a formative time. It's when you start discovering who you are and what you want to do. Studying abroad during these years can be a transformative experience.</p>
      <p>It builds independence, resilience, and confidence. You learn to manage your own time, money, and decisions.</p>
      <p>Moreover, it looks fantastic on university applications. Admissions officers love to see students who are curious, adventurous, and mature enough to handle international travel.</p>
    `,
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop',
        author: 'David Chen'
    },
    {
        id: '3',
        title: 'The Future of Tech: Insights from Silicon Valley',
        date: 'Aug 15, 2025',
        excerpt: 'Key takeaways from our recent student tour to the world\'s innovation capital.',
        content: `
      <p>We just returned from an incredible week in San Francisco with 20 bright students. We visited Google, Apple, and several promising startups.</p>
      <p>The biggest takeaway? The future is AI, but the human element remains irreplaceable. Tech leaders emphasized the need for empathy and ethical thinking in technology development.</p>
      <p>Join us next year for another deep dive into the world of technology and innovation.</p>
    `,
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop',
        author: 'Michael Ross'
    }
];
