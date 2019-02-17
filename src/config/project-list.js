const projectList = {
  projects: [
    
    {
      id: 'hackmoscow',
      title: 'Hack.Moscow v3.0',
      subtitle: 'Resn Little Helper\'s subtitle',
      description: 'A long time ago, before St. Nick, Father Christmas, Kris Kringle, Santa or whatever you wanna call him, there was an elf, some ’shrooms and a flute. The real first Christmas. Truth.',
      date: '<a href="http://resn.co.nz/" target="_blank">Resn</a> 2017',
      link: 'View website',
      url: 'http://littlehelper.resn.global/',
      role: '<div>Creative Developer</div>',
      technologies: '<div>WebGL</div><div>ThreeJS</div>',
      clients: null,
      awards: '<div><a href="https://www.awwwards.com/sites/resns-little-helper" target="_blank">Awwwards - SOTD</a></div><div><a href="https://thefwa.com/cases/resns-little-helper" target="_blank">FWA - SOTM</a></div>',
      medias: [
        { type: 'image', url: 'images/hackmoscow/1.jpg' },
      ],
    },
    {
      id: 'rusbase',
      title: 'Rusbase',
      subtitle: 'Resn Little Helper\'s subtitle',
      description: 'Célia Lopez is a junior 3D and interactive designer. I helped her to realize her portfolio.',
      date: '2018',
      link: 'View website',
      url: 'http://www.celialopez.fr',
      role: '<div>Creative Developer</div>',
      technologies: '<div>WebGL</div><div>ThreeJS</div>',
      clients: 'Célia Lopez',
      awards: '<div><a href="https://www.awwwards.com/sites/celia-lopez" target="_blank">Awwwards - SOTD</a></div><div><a href="https://thefwa.com/cases/portfolio-of-celia-lopez" target="_blank">FWA - SOTD</a></div><div><a href="https://www.cssdesignawards.com/sites/celia-lopez-portfolio/32742/" target="_blank">CSSDesignAwards - SOTD</a></div>',
      medias: [
        { type: 'image', url: 'images/projects/celia/1.jpg' },
      ],
    },
    {
      id: 'rh',
      title: 'Russian Hackers',
      subtitle: 'Resn Little Helper\'s subtitle',
      description: 'A long time ago, before St. Nick, Father Christmas, Kris Kringle, Santa or whatever you wanna call him, there was an elf, some ’shrooms and a flute. The real first Christmas. Truth.',
      date: '<a href="http://resn.co.nz/" target="_blank">Resn</a> 2017',
      link: 'View website',
      url: 'http://littlehelper.resn.global/',
      role: '<div>Creative Developer</div>',
      technologies: '<div>WebGL</div><div>ThreeJS</div>',
      clients: null,
      awards: '<div><a href="https://www.awwwards.com/sites/resns-little-helper" target="_blank">Awwwards - SOTD</a></div><div><a href="https://thefwa.com/cases/resns-little-helper" target="_blank">FWA - SOTM</a></div>',
      medias: [
        { type: 'image', url: 'images/hackmoscow/1.jpg' },
      ],
    },
  ],

  getProject(id) {
    return projectList.projects.find( project => project.id === id );
  },

};

module.exports = projectList;
