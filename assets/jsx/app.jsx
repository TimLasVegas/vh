


/**
 * Select the make
 * @prop    handleChange Called when an option is selected
 */
class SelectMake extends React.Component {
    handleChange(e) {
        this.props.handleChange(e.target.value);
    }

    render() {
        return (
            <p>
                <select id="make" class="form-control" onChange={this.handleChange.bind(this)}>
                    <option value="">Choose Make First</option>
                    <option value="Honda">Honda</option>
                    <option value="Toyota">Toyota</option>
                </select>
            </p>
        );
    }
}

/**
 * Select the model
 * @prop    options     The options to list
 * @prop    handleChange Called when an option is selected
 * @prop    disabled True/False for disabling the control
 */
class SelectModel extends React.Component {
    handleChange(e) {
        this.props.handleChange(e.target.value);
    }

    render() {
        return (
            <p>
                <select id="model" class="form-control" onChange={this.handleChange.bind(this)} disabled={this.props.disabled}>
                    {this.props.options.map((item) => (
                        <option value={item.value}>{item.label}</option>
                    ))}
                </select>
            </p>
       )
    }
}

/**
 * Search for the videos
 * @prop    make    The currently selected make
 * @prop    model   The currently select model
 * @prop    handleClick Called when a thumbnail is clicked
 */
class ButtonSearch extends React.Component {
    handleClick(e) {
        var self = this;
        e.preventDefault();
        self.props.handleClick();
    }

    render() {
        return (
            <p>
                <button id="search" disabled={this.props.disabled} onClick={this.handleClick.bind(this)} class="btn btn-primary">Search</button>
            </p>
        )
    }
}

/**
 * Lists the videos and (optionally) display the More Videos button when the nextPageToken is valid
 * @prop    make    The currently selected make
 * @prop    model   The currently select model
 * @prop    videos  Array of videos to list
 * @prop    nextPageToken   Token to pass for the next page of the result set
 * @prop    playVideo   Called to play a video
 * @prop    handleSearch    Called to get more videos
 */
class ListVideos extends React.Component {
    handleClick(videoId) {
        this.props.playVideo(videoId);
    }

    handleMoreVideos() {
        this.props.handleSearch({nextPageToken: this.props.nextPageToken});
    }

    render() {
        // We only display the More Videos button when we have more videos - sounds smart!
        let moreVideos = (<p></p>);
        if (isValidString(this.props.nextPageToken)) {
            moreVideos = (
                <p>
                    <button id="more-videos" onClick={this.handleMoreVideos.bind(this)} class="btn btn-primary">More Videos</button>
                </p>
            );
        }
        
        return (
            <div>
                {this.props.videos.map(function(video) {
                    return (
                        <div class="video-thumbnail" onClick={this.handleClick.bind(this, video.id.videoId)}>
                            <img src={video.snippet.thumbnails.medium.url} />
                            <p class="title"><strong>{video.snippet.title}</strong></p>
                            <p class="description">{video.snippet.description}</p>
                        </div>
                    )
                }, this)}
                {moreVideos}
            </div>
        )
    }
}

/**
 * Called to play a video by inserting the YouTube iFrame
 * @prop    videoId     ID of the video to play
 */
class PlayVideo extends React.Component {
    render() {
        if (isValidString(this.props.videoId)) {
            return (
                <iframe
                    id="player"
                    type="text/html"
                    height="400px" width="100%"
                    src={"http://www.youtube.com/embed/" + this.props.videoId + "?enablejsapi=1&origin=http://example.com&autoplay=1"}
                    frameborder="0"></iframe>
            )
        } else {
            return (
                <img src="assets/images/youtube.png" />
            )
        }
    }
}

/**
 * List the additional keyword filters
 * @prop    keywords    Keywords to act as additional filters
 * @prop    filterString    All checked words combined as a filter string
 * @prop    onChange    Call to make when they check/uncheck a filter keyword
 *
 */
class FilterKeywords extends React.Component {
    handleClick() {
        // Build the string and return
        this.props.onChange({
            filterString: this.props.keywords.filter(function(word, index) {
                                return ($("#filter-keyword-"+index).is(':checked'));
                           }).join(' ')
            }
        );
    }

    render() {
        var self = this;
        return (
            <div class="panel panel-info">
                <div class="panel-heading">
                    Additional Keyword Filters
                </div>
                <div class="filter-keywords panel-body">
                    <ul>
                    {this.props.keywords.map(function(word, index) {
                        return (
                            <li>
                                <label>
                                    <input type="checkbox" id={"filter-keyword-"+index} onClick={self.handleClick.bind(self)} />
                                    {word}
                                </label>
                            </li>
                        )
                    })}
                    </ul>
                </div>
            </div>
        )
    }
}



/**
 * Where magic begins!
 */
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videos: [],
            selectedMake: '',
            selectedModel: '',
            disabledModel: true,
            disabledSearch: true,
            optionsModel: [
                { value: '', label: 'Model' }
            ],
            playVideoId: '',
            nextPageToken: '',
            filterKeywords: [],
            filterString: ''

        };
    }

    /**
     * Called when the user selects a make
     * @param make
     */
    handleMakeChange(make) {
        this.clearSearchResults();
        this.setState({
            selectedMake: make,
            selectedModel: '',
            disabledModel: (make == ''),
            disabledSearch: (make == '')
        });
        if (make == '') {
            this.setState({
                optionsModel: [
                    {value: '', label: 'Model'}
                ]
            });
        } else {
            if (make == 'Honda') {
                this.setState({
                    selectedModel: 'Accord',
                    optionsModel: [
                        {value: 'Accord', label: 'Accord'},
                        {value: 'Civic', label: 'Civic'},
                        {value: 'CrossTour', label: 'CrossTour'},
                        {value: 'Fit', label: 'Fit'}
                    ]
                });
            }
            if (make == 'Toyota') {
                this.setState({
                    selectedModel: 'Camry',
                    optionsModel: [
                        {value: 'Camry', label: 'Camry'},
                        {value: 'RAV4', label: 'RAV4'},
                        {value: 'Highlander', label: 'Highlander'},
                        {value: 'Sienna', label: 'Sienna'}
                    ]
                });
            }
            // Set the first option as selected
            $("#model option:selected").prop("selected", false);
            $("#model option:first").prop("selected", "selected");
        }
    }

    /**
     * Called when the user selects a model
     * @param model
     */
    handleModelChange(model) {
        this.setState({ selectedModel: model });
        this.clearSearchResults();
    }

    /**
     * Called with new search results
     * @param parms key/value pairs (nextPageToken, filterString)
     */
    search(parms) {
        parms = (parms) ? parms : {};
        let self = this;
        let search = this.state.selectedMake  + ' ' + this.state.selectedModel;
        let nextPageToken = null;
        let filterString = this.state.filterString;
        let newKeywords = true;

        // Are we trying to get more results?
        nextPageToken = (parms.hasOwnProperty('nextPageToken')) ? parms.nextPageToken : nextPageToken;

        // Was there a change to the filterString? If so, we will clear the video listing.
        if (parms.hasOwnProperty('filterString')) {
            this.clearSearchResults(true);
            filterString = parms.filterString;
        }

        // Is there an active filterString? If so, do not generate new keywords.
        if (isValidString(filterString)) {
            newKeywords = false;
        }

        // Update any changes to the filterString
        this.setState({filterString: filterString});

        // Add any filterString to the search string
        search = search + ' ' + filterString;

        // Search
        if (debug) {
            console.log(search);
            console.log(nextPageToken);
            console.log(filterString);
            console.log('');
        }
        var yt = new Youtube();
        yt.search(search, nextPageToken).then(
            function (results) {
                if (debug) console.log(results);
                let newResults = self.state.videos.concat(results.items);
                self.setState({
                    videos: newResults,
                    nextPageToken: (results.hasOwnProperty("nextPageToken") && results.items.length == 20) ? results.nextPageToken : ''
                });

                // Async call to develop the 10 most popular keywords, so we can offer additional filtering
                // We only do this when filterKeywords is empty
                if (newKeywords) {
                    self.generateFilterKeywords(newResults)
                        .then(function (keywords) {
                                self.setState({filterKeywords: keywords});
                            }
                        );
                }
            }
        );
    }

    /**
     * Called to play a video
     * @param videoId
     */
    playVideo(videoId) {
        this.setState({playVideoId: videoId});
    }

    /**
     * Clear the search results
     * @param partial True when we just want to clear the array and nextPageToken
     */
    clearSearchResults(partial) {
        this.setState({
            videos: [],
            nextPageToken: ''
        });
        if (!partial) {
            this.setState({
                filterKeywords: [],
                filterString : ''
            })
        }
    }

    /**
     * Build the filtering keywords from the search results.
     * @param results
     */
    generateFilterKeywords(results) {
        var make = this.state.selectedMake.toLowerCase();
        var model = this.state.selectedModel.toLowerCase();
        return new Promise(function(resolve) {
            var list = [];
            results.map(function(video) {
                if (video.hasOwnProperty('snippet') && video.snippet.hasOwnProperty('title')) {
                    video.snippet.title.split(' ').map(function(word) {
                        // Get rid of any trailing commas and periods
                        word = word.replace(/[,.:()]/,'').trim();
                        // Ignore small words and the current make and model
                        if (word.length > 5 && word.length < 15 && !(word.toLowerCase() == make || word.toLowerCase() == model)) {
                            let index = list.findIndex(function(obj) {
                                return obj.word == word;
                            });
                            // If found, increment the count.
                            if (index >= 0) {
                                list[index].count++;
                            } else {
                                // Add
                                list.push({word: word, count: 1});
                            }
                        }
                    });
                }
            });
            // Sort the array
            list = list.sort(function(a,b) {return (b.count - a.count)});
            // Return the top 15
            return resolve(list.slice(0,15).map(function(obj) {
                return obj.word;
            }));
        });
    }


    /**
     * Render
     */
    render() {
        return (
            <div>
                <div class="row header">
                    <div class="col col-sm-3">
                        <a href="/"><img src="//d3rdv3saj7j6nd.cloudfront.net/images/vehiclehistory_logo.png" alt="VehicleHistory.com - Vin check vehicle history with our free vin lookup and make model year search tools"/></a>
                    </div>
                    <div class="col col-sm-9">
                        <span class="title">YOUTUBE VIDEOS</span>
                    </div>
                </div>

                <div class="row content">
                    <div class="col-sm-3 search-options">
                        <div class="panel panel-info">
                            <div class="panel-heading">
                                Search Options
                            </div>
                            <div class="panel-body">
                                <form id="search-form" action="#">
                                    <SelectMake handleChange={this.handleMakeChange.bind(this)}  />
                                    <SelectModel handleChange={this.handleModelChange.bind(this)} disabled={this.state.disabledModel}  options={this.state.optionsModel}/>
                                    <ButtonSearch make={this.state.selectedMake} model={this.state.selectedModel} disabled={this.state.disabledSearch} handleClick={this.search.bind(this)} />
                                </form>
                            </div>
                        </div>
                        <div id="results"></div>
                        <div id="mobile-message" class="footer mobile-footer bg-info"></div>

                        {/* Setup panel of additional keyword filters when they have search results */}
                        <div>
                            <FilterKeywords keywords={this.state.filterKeywords} onChange={this.search.bind(this)}/>
                        </div>
                    </div>

                    <div class="col-sm-6 youtube">
                        <div id="youtube-content" class="youtube">
                            <PlayVideo videoId={this.state.playVideoId} />
                        </div>
                        <div id="ad1">
                            <img src="assets/images/toyota_728x90.jpg" />
                        </div>
                    </div>

                    <div class="col-sm-3">
                        <div class="panel panel-info video-list">
                            <div class="panel-heading">
                                Search Results
                            </div>
                            <div class="panel-body">
                                <ListVideos make={this.state.selectedMake} model={this.state.selectedModel} videos={this.state.videos} nextPageToken={this.state.nextPageToken} playVideo={this.playVideo.bind(this)} handleSearch={this.search.bind(this)}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row footer desktop-footer bg-info">
                    <div class="col">
                        <div id="desktop-message" class="message"></div>
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App />,  document.getElementById("root"));

