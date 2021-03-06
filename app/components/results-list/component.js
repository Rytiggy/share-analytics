import Ember from 'ember';


export default Ember.Component.extend({

    data : [],

    init(){
        this._super(...arguments);
        let data = this.processData(this.get('data.hits.hits'));
        this.set('data', data);
    },

    processData (data) {
        return data.map((datum) => {
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            options.timeZone = 'UTC';
            options.timeZoneName = 'short'
            if (datum._source.description) {
                datum["description_truncated"] = datum._source.description.substring(0,200)+"..."
            }
            if (datum._source.date) {
                datum["_source"]["date"] = (new Date(datum["_source"]["date"])).toLocaleDateString('en-US', options);
            }
            if (datum._source.date_created) {
                datum["_source"]["date_created"] = (new Date(datum["_source"]["date_created"])).toLocaleDateString('en-US', options)
            }
            if (datum._source.date_modified) {
                datum["_source"]["date_modified"] = (new Date(datum["_source"]["date_modified"])).toLocaleDateString('en-US', options)
            }
            if (datum._source.date_published) {
                datum["_source"]["date_published"] = (new Date(datum["_source"]["date_published"])).toLocaleDateString('en-US', options)
            }
            if (datum._source.date_updated) {
                datum["_source"]["date_updated"] = (new Date(datum["_source"]["date_updated"])).toLocaleDateString('en-US', options)
            }
            return datum;
        });
    },

    actions: {

        transitionToFacet(facet_name, parameter_name, parameter_value) {
            let queryParams = {};
            queryParams[parameter_name] = parameter_value;
            this.attrs.transitionToFacet(facet_name, queryParams);
        },

        pageback() {
            let queryParams = {};
            let page = Number(this.parameters["page"]);
            if (!page) {
                page = 0;
            }
            page = page-10;
            if (page < 0) {
                page = 0;
            }
            queryParams["page"] = page
            this.attrs.transitionToFacet("search", queryParams);
        },
        pagenext() {
            let queryParams = {};
            let page = Number(this.parameters["page"]);
            if (!page) {
                page = 0;
            }
            page = page+10;
            if (page < 0) {
                page = 0;
            }
            queryParams["page"] = page
            this.attrs.transitionToFacet("search", queryParams);
        }

    }

});
