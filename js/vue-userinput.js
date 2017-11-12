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

var countFilter = new Vue({
  el: '#count-filter',
  data: {
    filterName: "Count",
    countValue: ""
  }
})

var yearFilter = new Vue({
  el: '#year-filter',
  data: {
    filterName: "Year",
    startYear: "",
    endYear:""
  }
})

var authorFilter = new Vue({
  el: '#author-filter',
  data: {
    filterName: "Author",
    authorNames: ""
  }
})

var venueFilter = new Vue({
  el: '#venue-filter',
  data: {
    filterName: "Venue",
    venueNames: ""
  }
})

var paperFilter = new Vue({
  el: '#paper-filter',
  data: {
    filterName: "Paper",
    paperNames: ""
  }
})
