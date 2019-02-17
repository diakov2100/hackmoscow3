const experimentList = {
  experiments: [
    
  ],

  getProject(id) {
    return experimentList.experiments.find( project => project.id === id );
  },

};

module.exports = experimentList;
