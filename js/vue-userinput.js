if (document.getElementById("measure-dropdown") != null) {
  var measureDropdown = new Vue({
    el: '#measure-dropdown',
    mixins: [VueClickaway.mixin],
    data: {
      filterName: "Measure",
      selectedMeasure: "paper",
      measures: [
        { name: "paper" },
        { name: "author"},
        { name: "venue"},
        { name: "incitation"},
        { name: "outcitation"}
      ],
      toggle: false
    },
     methods: {
      toggledropdown: function() {
        this.toggle = !this.toggle;
      },
      changeMeasure: function(measure) {
        this.selectedMeasure = measure;
        this.toggle = false;
      },
      clickaway: function() {
        this.toggle = false;
      }
    }
  })
}

if (document.getElementById("category-dropdown") != null) {
  var categoryDropdown = new Vue({
    el: '#category-dropdown',
    mixins: [VueClickaway.mixin],
    data: {
      filterName: "Category",
      selectedCategory: "total",
      categories: [
        { name: "total" },
        { name: "paper" },
        { name: "author"},
        { name: "venue"}
      ],
      toggle: false
    },
     methods: {
      toggledropdown: function() {
        this.toggle = !this.toggle;
      },
      changeCategory: function(category) {
        this.selectedCategory = category;
        this.toggle = false;
      },
      clickaway: function() {
        this.toggle = false;
      }
    }
  })
}

if (document.getElementById("category-no-total-dropdown") != null) {
  var categoryNoTotalDropdown = new Vue({
    el: '#category-no-total-dropdown',
    mixins: [VueClickaway.mixin],
    data: {
      filterName: "Category",
      selectedCategory: "venue",
      categories: [
        { name: "paper" },
        { name: "author"},
        { name: "venue"}
      ],
      toggle: false
    },
     methods: {
      toggledropdown: function() {
        this.toggle = !this.toggle;
      },
      changeCategory: function(category) {
        this.selectedCategory = category;
        this.toggle = false;
      },
      clickaway: function() {
        this.toggle = false;
      }
    }
  })
}

if (document.getElementById("count-filter") != null) {
  var countFilter = new Vue({
    el: '#count-filter',
    data: {
      filterName: "Count",
      countValue: ""
    }
  })
}

if (document.getElementById("year-filter") != null) {
  var yearFilter = new Vue({
    el: '#year-filter',
    data: {
      filterName: "Year",
      startYear: "",
      endYear:""
    }
  })
}

if (document.getElementById("single-year-filter") != null) {
  var singleYearFilter = new Vue({
    el: '#single-year-filter',
    data: {
      filterName: "Year",
      year: ""
    }
  })
}

if (document.getElementById("author-filter") != null) {
  var authorFilter = new Vue({
    el: '#author-filter',
    data: {
      filterName: "Author",
      authorNames: ""
    }
  })
}

if (document.getElementById("venue-filter") != null) {
  var venueFilter = new Vue({
    el: '#venue-filter',
    data: {
      filterName: "Venue",
      venueNames: ""
    }
  })
}

if (document.getElementById("paper-filter") != null) {
  var paperFilter = new Vue({
    el: '#paper-filter',
    data: {
      filterName: "Paper",
      paperNames: ""
    }
  })
}

if (document.getElementById("level-filter") != null) {
  var levelFilter = new Vue({
    el: '#level-filter',
    data: {
      filterName: "Depth",
      level: ""
    }
  })
}

if (document.getElementById("ignore-filter") != null) {
  var ignoreFilter = new Vue({
    el: '#ignore-filter',
    data: {
      filterName: "Stop Words",
      stopWords: ""
    }
  })
}
