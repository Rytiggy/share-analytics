import Ember from 'ember';
import ENV from 'analytics-dashboard/config/environment';
import stringify from 'npm:json-stable-stringify';
import dateInterval from '../../utils/date-interval';


const helpText = {
    'Total Results': 'Number of unique items returned by your search',
    'Data Providers': 'Organizations or agents, such as publishers, repositories, data centers, archives, and funders, making these resources available. A given resource may list more than one data provider, for example, the Association (e.g. Association for Computing Machinery) and the Association`s Press (ACM Press).',
    'Types':'Resources, or items, are categorized into Types (article, data set, dissertation, etc.). Any resource not categorized by the Source will appear under Creative Work by default.',
    'Tags': 'Keywords, subjects, and topics that describe the research output. Those listed here are the most frequently listed tags in content aggregated by SHARE.',
    'Funders': 'Organizations, institutions, foundations, or groups that provided financial support for the research',
    'Dates': 'Date information about the resource was last updated by Source',
    'Top Contributors': 'Individuals, organizations, or institutions involved in the production of the resource. Their contribution could be intellectual, material, or financial. Those listed here are the most frequently named contributors in content aggregated by SHARE.',
    'filter-plaques': 'A list of your current search terms, click on X within each box to remove the filter from your current search.',
    'Contributors':'Individuals, organizations, or institutions involved in the production of the resource. Their contribution could be intellectual, material, or financial.'
}
//import Q from 'npm:q';
const agg_types = [ // agg_types is this array literal, reduced by the following fn

    //
    // Average Aggregation
    // *******************
    {
        'elastic_name':'avg',
        'pretty_name': 'Average',
        'description': 'A single-value metrics aggregation that computes the average of numeric values that are extracted from the aggregated documents. These values can be extracted either from specific numeric fields in the documents, or be generated by a provided script. Script support is not enabled at this time.',
        'options': [
            {
                'elastic_name': 'field',
                'pretty_name': 'Field',
                'description': 'The name of the field to calculate the average over',
                'isValid': function() {
                    return true;
                }
            }, {
                'elastic_name': 'missing',
                'pretty_name': 'Missing',
                'description': 'A value to use as a default if a given document does not have a given field. Ignored by default. Documents without a value at \'field\' will be placed into this bucket',
                'isValid': function() {
                    return true;
                }
            }
        ],
    },

    //
    // Cardinality Aggregation
    // ***********************
    {
        'elastic_name': 'cardinality',
        'pretty_name': 'Cardinality',
        'description': 'A single-value metrics aggregation that calculates an approximate count of distinct values. Values can be extracted either from specific fields in the document or generated by a script. Script support is not enabled at this time.',
        'options': [
            {
                'elastic_name': 'field',
                'pretty_name': 'Field',
                'description': 'The name of the field to calculate the cardinality of',
                'isValid': function() {
                    return true;
                }
            }, {
                'elastic_name': 'precision_threshold',
                'pretty_name': 'Precision Threshold',
                'description': 'The precision_threshold options allows to trade memory for accuracy, and defines a unique count below which counts are expected to be close to accurate. Above this value, counts might become a bit more fuzzy. The maximum supported value is 40000, thresholds above this number will have the same effect as a threshold of 40000. The default values is 3000.',
                'isValid': function() {
                    return true;
                }
            }, {
                'elastic_name': 'missing',
                'pretty_name': 'Missing',
                'description': 'A value to use as a default if a given document does not have a given field. Ignored by default. Documents without a value at \'field\' will be placed into this bucket',
                'isValid': function(value) {
                    return true;
                }
            }
        ]
    },

    //
    // Extended Stats Aggregation
    // **************************
    {
        'elastic_name': 'extended_stats',
        'pretty_name': 'Extended Stats',
        'description': 'A multi-value metrics aggregation that computes stats over numeric values extracted from the aggregated documents. These values can be extracted from specific numeric fields in the documents. The extended_stats aggregations is an extended version of the stats aggregation, where additional metrics are added such as sum_of_squares, variance, std_deviation and std_deviation_bounds.',
        'options': [
            {
                'elastic_name': 'field',
                'pretty_name': 'Field',
                'description': 'The field setting defines the numeric field of the documents the stats will be computed on.',
                'isValid': function() {
                    return true;
                }
            }, {
                'elastic_name': 'sigma',
                'pretty_name': 'Sigma',
                'description': 'By default, the extended_stats metric will return an object called std_deviation_bounds, which provides an interval of plus/minus two standard deviations from the mean. This can be a useful way to visualize variance of your data. If you want a different boundary, for example three standard deviations, you can set sigma in the request. Sigma can be any non-negative double, meaning you can request non-integer values such as 1.5. A value of 0 is valid, but will simply return the average for both upper and lower bounds. The standard deviation and its bounds are displayed by default, but they are not always applicable to all data-sets. Your data must be normally distributed for the metrics to make sense. The statistics behind standard deviations assumes normally distributed data, so if your data is skewed heavily left or right, the value returned will be misleading.',
                'isValid': function*() {
                    return true;
                }
            }, {
                'elastic_name': 'missing',
                'pretty_name': 'Missing',
                'description': 'A value to use as a default if a given document does not have a given field. Ignored by default.',
                'isValid': function(value) {
                    return true;
                }
            }
        ]
    },

    //
    // Maximum Aggregation
    // **************************
    {
        'elastic_name': 'max',
        'pretty_name': 'Maximum',
        'description': 'A single-value metrics aggregation that keeps track and returns the maximum value among the numeric values extracted from the aggregated documents.',
        'options': [
            {
                'elastic_name': 'field',
                'pretty_name': 'Field',
                'description': 'The field setting defines the numeric field of the documents the maximum will be computed on.',
                'isValid': function() {
                    return true;
                }
            }, {
                'elastic_name': 'missing',
                'pretty_name': 'Missing',
                'description': 'A value to use as a default if a given document does not have a given field. Ignored by default.',
                'isValid': function(value) {
                    return true;
                }
            }
        ]
    },

    //
    // Minimum Aggregation
    // **************************
    {
        'elastic_name': 'min',
        'pretty_name': 'Minimum',
        'description': 'A single-value metrics aggregation that keeps track and returns the minimum value among the numeric values extracted from the aggregated documents.',
        'options': [
            {
                'elastic_name': 'field',
                'pretty_name': 'Field',
                'description': 'The field setting defines the numeric field of the documents the minimum will be computed on.',
                'isValid': function() {
                    return true;
                }
            }, {
                'elastic_name': 'missing',
                'pretty_name': 'Missing',
                'description': 'A value to use as a default if a given document does not have a given field. Ignored by default.',
                'isValid': function(value) {
                    return true;
                }
            }
        ]
    },

    //
    // Percentiles Aggregation
    // **************************
    {
        'elastic_name': 'percentiles',
        'pretty_name': 'Percentiles',
        'description': 'A multi-value metrics aggregation that calculates one or more percentiles over numeric values extracted from the aggregated documents. Percentiles show the point at which a certain percentage of observed values occur. For example, the 95th percentile is the value which is greater than 95% of the observed values. Percentiles are often used to find outliers. In normal distributions, the 0.13th and 99.87th percentiles represents three standard deviations from the mean. Any data which falls outside three standard deviations is often considered an anomaly. When a range of percentiles are retrieved, they can be used to estimate the data distribution and determine if the data is skewed, bimodal, etc.',
        'options': [
            {
                'elastic_name': 'field',
                'pretty_name': 'Field',
                'description': 'The field setting defines the numeric field of the documents the percentiles will be computed on.',
                'isValid': function() {
                    return true;
                }
            }, {
                'elastic_name': 'percents',
                'pretty_name': 'Percents',
                'description': 'Specify just the percents we are interested in (requested percentiles must be a value between 0-100 inclusive)',
                'isValid': function() {
                    return true;
                }
            }, {
                'elastic_name': 'missing',
                'pretty_name': 'Missing',
                'description': 'A value to use as a default if a given document does not have a given field. Ignored by default.',
                'isValid': function(value) {
                    return true;
                }
            }
        ]
    },

    //
    // Percentile Ranks Aggregation
    // *****************************
    {
        'elastic_name': 'percentile_ranks',
        'pretty_name': 'Percentile Ranks',
        'description': 'A multi-value metrics aggregation that calculates one or more percentiles over numeric values extracted from the aggregated documents. Percentile rank shows the percentage of observed values which are below certain value. For example, if a value is greater than or equal to 95% of the observed values it is said to be at the 95th percentile rank.',
        'options': [
            {
                'elastic_name': 'field',
                'pretty_name': 'Field',
                'description': 'The field setting defines the numeric field of the documents the minimum will be computed on.',
                'isValid': function() {
                    return true;
                }
            }, {
                'elastic_name': 'values',
                'pretty_name': 'Values',
                'description': 'Specify just the values we are interested in',
                'isValid': function() {
                    return true;
                }
            }, {
                'elastic_name': 'missing',
                'pretty_name': 'Missing',
                'description': 'A value to use as a default if a given document does not have a given field. Ignored by default.',
                'isValid': function(value) {
                    return true;
                }
            }
        ]
    },

    //
    // Stats  Aggregation
    // *****************************
    {
        'elastic_name': 'stats',
        'pretty_name': 'Stats',
        'description': 'The stats that are returned consist of: min, max, sum, count and avg.',
        'options': [
            {
                'elastic_name': 'field',
                'pretty_name': 'Field',
                'description': 'The field setting defines the numeric field of the documents the stats will be calculated on.',
                'isValid': function() {
                    return true;
                }
            }, {
                'elastic_name': 'missing',
                'pretty_name': 'Missing',
                'description': 'A value to use as a default if a given document does not have a given field. Ignored by default.',
                'isValid': function(value) {
                    return true;
                }
            }
        ]
    },

    //
    // Sum Aggregation
    // *****************************
    {
        'elastic_name': 'sum',
        'pretty_name': 'Sum',
        'description': 'A single-value metrics aggregation that sums up numeric values that are extracted from the aggregated documents. These values can be extracted either from specific numeric fields in the documents',
        'options': [
            {
                'elastic_name': 'field',
                'pretty_name': 'Field',
                'description': 'The field setting defines the numeric field of the documents to be summed.',
                'isValid': function() {
                    return true;
                }
            }, {
                'elastic_name': 'missing',
                'pretty_name': 'Missing',
                'description': 'A value to use as a default if a given document does not have a given field. Ignored by default.',
                'isValid': function(value) {
                    return true;
                }
            }
        ]
    },

    //
    // Value Count Aggregation
    // *****************************
    {
        'elastic_name': 'value_count',
        'pretty_name': 'Value Count',
        'description': 'A single-value metrics aggregation that counts the number of values that are extracted from the aggregated documents. These values can be extracted either from specific fields in the documents, or be generated by a provided script. Typically, this aggregator will be used in conjunction with other single-value aggregations. For example, when computing the avg one might be interested in the number of values the average is computed over.',
        'options': [
            {
                'elastic_name': 'field',
                'pretty_name': 'Field',
                'description': 'The field setting defines the numeric field of the documents to be summed.',
                'isValid': function() {
                    return true;
                }
            }
        ]
    },

    //
    // Date Histogram Aggregation
    // **************************
    {
        'elastic_name': 'date_histogram',
        'pretty_name': 'Date Histogram',
        'description': 'A multi-bucket aggregation similar to the histogram except it can only be applied on date values. Scripting is not supported at this time.',
        'options': [
            {
                'elastic_name': 'field',
                'pretty_name': 'Field',
                'description': 'The name of the field that contains the date to build the histogram from',
                'isValid': function() {
                    return true;
                }
            }, {
                'elastic_name': 'interval',
                'pretty_name': 'Interval',
                'description': 'The field setting defines the numeric field of the documents the stats will be computed on.',
                'isValid': function() {
                    return true;
                }
            }, {
                'elastic_name': 'offset',
                'pretty_name': 'Offset',
                'description': 'The offset parameter is used to change the start value of each bucket by the specified positive (+) or negative offset (-) duration, such as 1h for an hour, or 1M for a month.',
                'isValid': function() {
                    return true;
                }
            }
        ]
    },

].reduce(function(agg_list, agg_meta) {

    agg_meta.class = class {

        constructor() {
            this.meta = agg_meta
        }

        createAggregations() {
            return this.meta.options.reduce(function(aggs, agg_meta) {
                let agg_name = agg_meta.elastic_name;
                let agg = this[agg_name];
                if (!agg_meta.isValid(agg)) {
                    throw agg;
                }
                aggs[agg_name] = agg;
                return aggs;
            }, {});
        }

    }

    return agg_list[agg_meta.elastic_name] = agg_meta;

}, {});

export default Ember.Component.extend({


    aggregations: false,
    docs: false,
    loadingData: Ember.computed('data', function(){
        return !this.get('data');
    }),

    classNameBindings: ['configuring', 'picking', 'width', 'height'],

    widgetType: null,
    name: 'tobeDetermined',
    jsEngine: 'c3',
    widthSetting: 2,
    heightSetting: 2,
    height: Ember.computed(function() {
      return this.get('item').height;
    }),
    width: Ember.computed('widthSetting', function() {

        let new_setting = this.get('widthSetting');
        let current_setting = this.get('currentWidth');

        if (new_setting < 1) {
            new_setting = current_setting;
        }
        if (new_setting > 12) {
            new_setting = 12;
        }

        this.set('currentWidth', new_setting)

        return "col-md-" + new_setting;

    }),

    computedHeight: 200,
    computedWidth: 200,

    router: Ember.inject.service('router'),
    resizedSignal: false,

    // Initialize our query parameters
    query: 'UC',
    gte: "1996-01-01",
    lte: (new Date()).toISOString().split('T')[0], // Set the ending date of our query to today's date, by default

    tsInterval: Ember.computed('gte','lte', function(){
      let d1 = new Date(this.get('gte'));
      let d2 = new Date(this.get('lte'));
      return dateInterval(d1, d2);
    }),

    configuring: false,
    picking: false,

    helpText,
    showHelpText: true,

    init() {
        this._super(...arguments);
        this.set('widthSetting', this.get('item').width);
        Promise.resolve(this.fetchWidgetData()).then(() =>{
            return this.applyGraphSetting();
        });
        if(this.get('item.name') == '' || this.get('item.name') == 'Highlighted Collections' || this.get('item.name') == 'Recently Added' || this.get('item.name') == 'Top Tags'){
           this.set('showHelpText' , false)
        } 
        if(this.get('item.widgetType') == 'filter-plaques'){

           this.set('showHelpText' , true)
        }
    },

    didRender() {
        this.set('computedHeight',  this.$().height());
        this.set('computedWidth', this.$().width());

  //
  //  Use a closure to hide the local variables from the
  //  global namespace
  //


        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

    },

    fetchWidgetData: async function() {
        if(this.get('item').post_body === null){
            return;
        }
        let query = this.get('query');
        let gte = this.get('gte');
        let lte = this.get('lte');
        let interval = this.get('tsInterval');
        let item = this.get('item');
        var endpoint ='records/_search?request_cache=true';
        if (item.endpoint) {
            endpoint = '/share/search/' + item.endpoint + '/_search?request_cache=true';
        }
        if (item.indexVersion) {
            endpoint += "&v=" + item.indexVersion;
        }
        if (!this.get('item').post_body) {
            this.set('data', {})
            return;
        }
        let data = await Ember.$.ajax({
            url: ENV.apiUrl + endpoint,
            crossDomain: true,
            type: 'POST',
            contentType: 'application/json',
            data: stringify(this.get('item').post_body, {
                replacer: function(key, value) {
                    if (Array.isArray(value)) {
                        return value.filter(Object);
                    }
                    return value;
                }
            })
        });
        this.set('data', data);
        this.set('aggregations', data.aggregations);
        this.set('total', data.hits.total);

        if(item.chartType === 'relatedResearchers') {
            this.set('total', data.aggregations.relatedContributors.value);
        }

        /*this.set('docs', data.hits.hits.map((hit) => {
            let source = Ember.Object.create(hit._source);
            let r = source.getProperties('type', 'title', 'description', 'language', 'date', 'date_created', 'date_modified', 'date_updated', 'date_published', 'tags', 'sources');
            r.id = hit._id;
            r.contributors = source.lists.contributors;
            r.funders = source.lists.funders;
            r.publishers = source.lists.publishers;
            r.institutions = source.lists.institutions;
            r.organizations = source.lists.organizations;
            return r;
        }));
        */
    },

    applyGraphSetting: function(){
        this.set('chartType', this.get('item').chartType);
        this.set('widgetType', this.get('item').widgetType);
    },

    configureQuery: function() {
            },

    actions: {

        addChart: function(option) {
            this.sendAction('addChart', option);
        },

        showConfig: function() {
            this.set('configuring', !this.get('configuring'));
            this.set('picking', false);
        },

        showPicker: function() {
            this.set('picking', !this.get('picking'));
            this.set('configuring', false);
        },

        changeEngine: function(jsEngine){
            console.log(jsEngine);
        },

        changeChart: function(chart){
            this.set('chartType', chart);
        },

        widgetPicked: function(index){
            let selectedWidget = this.get('widgets')[index];
            this.set('item', selectedWidget);
            console.log(this.get('item').name);
            Promise.resolve(this.fetchWidgetData()).then(() => {
                return this.applyGraphSetting();
            });
        },

        removeWidget: function() {
            this.sendAction('removeChart', this.get('item'))
        },
        configChanged: function() {
            this.set('configuring', !this.get('configuring'));
            let name = this.get('name');
            if (this.get('resizedSignal') == true) return;
            this.set('resizedSignal', true);
            this.set('configuring', false);
        },

        transitionToFacet: function(dashboardName, newQueryParams) {
            let self = this;
            var queryParams = Object.keys(newQueryParams).reduce((acc, cur, idx, arr) => {
                acc[cur] = newQueryParams[cur];
                return acc;
            }, this.get("parameters"));
            this.get('router').transitionTo('dashboards.dashboard', dashboardName, {
                queryParams: queryParams
            }).then(function(route) {
                //Ember.run.schedule('afterRender', self, function() {
                //    let controller = route.get('controller');
                //    Object.keys(queryParams).map((key) => {
                //        controller.set(key, queryParams[key]);
                //    });
                //    controller.set('back', 'backroute');
                //});
                //route.refresh();
            });
        },

        saveWidget: function(){
            console.log('saveWidget');
            let widgetType = this.get('chartType');
            let name = this.get('name');
            let jsEngine = this.get('jsEngine');
            let chartType = this.get('chartType');
            let author = "tobeDetermined";
            let width = this.get('widthSetting');
            let height = this.get('heightSetting');

            let q = this.get('q');
            let gte = this.get('gte');
            let lte = this.get('lte');
            let interval = this.get('tsInterval');
            let query = {
                query: {bool: {
                    must: [{
                        query_string: {query: q}
                    }, {
                        range: {date: {
                            gte: gte,
                            lte: lte,
                            format: "yyyy-MM-dd||yyyy"
                        }}
                    }]
                }},
                from: 0,
                aggregations: {
                    sources: {
                        terms: {
                             field: 'sources.raw',
                             size: 200
                        }
                    },
                    contributors : {
                        terms : {
                            field: 'contributors.raw',
                            size: 200
                        }
                    },
                    tags : {
                        terms : {
                            field: 'tags.raw',
                            size: 200
                        }
                    },
                    articles_over_time: {
                        date_histogram: {
                            field: 'date',
                            interval: interval,
                            format:'yyyy-MM-dd'
                        },
                        aggregations: {
                            arttype: {terms: {field: 'type'}}
                        }
                    }
                }
            };
            let settings = {jsEngine: jsEngine, chartType: chartType};
            let information = {
                name: name,
                width: width,
                height: height,
                query: query,
                settings: settings,
            };

            this.sendAction('dashboardSaveWidget', information);
        }

    },

});
