


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
                    {this.props.options.map((item, index) => (
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
        // Use jQuery to scroll back to the top
        $('#video-list').animate({
            scrollTop: 0
        }, 0);
        // Search
        var yt = new Youtube();
        yt.search(this.props.make + ' ' + this.props.model).then(
            function (results) {
                self.props.handleClick(results);
            }
        );
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
        var self = this;
        var yt = new Youtube();
        yt.search(this.props.make + ' ' + this.props.model, this.props.nextPageToken).then(
            function (results) {
                self.props.handleSearch(results);
            }
        );
    }

    render() {
        // We only display the More Videos button when we have more videos - sounds smart!
        let moreVideos = (<div></div>);
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
 * Called to play a video by insering the YouTube iFrame
 * @prop    videoId     ID of the video to play
 */
class PlayVideo extends React.Component {
    render() {
        if (isValidString(this.props.videoId)) {
            var src = "http://www.youtube.com/embed/" + this.props.videoId + "?enablejsapi=1&origin=http://example.com&autoplay=1";
            return (
                <iframe id="player" type="text/html" height="400px" width="100%" src={src} frameborder="0"></iframe>
            )
        } else {
            return (
                <img src="assets/images/youtube.png" />
            )
        }
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
            nextPageToken: ''
        };
    }

    /**
     * Called when the user selects a make
     * @param make
     */
    handleMakeChange(make) {
        this.setState({
            selectedMake: make,
            selectedModel: '',
            videos: [],
            nextPageToken: '',
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
        this.setState({
            selectedModel: model,
            videos: [],
            nextPageToken: ''
        });
    }


    /**
     * Called with new search results
     * @param results   Videos that were received
     */
    handleSearch(results) {
        this.setState({
            videos: this.state.videos.concat(results.items),
            nextPageToken: (results.hasOwnProperty("nextPageToken")) ? results.nextPageToken : ''
        });
    }

    /**
     * Called to play a video
     * @param videoId
     */
    playVideo(videoId) {
        this.setState({playVideoId: videoId});
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
                        <form id="search-form" action="#">
                            <SelectMake handleChange={this.handleMakeChange.bind(this)}  />
                            <SelectModel handleChange={this.handleModelChange.bind(this)} disabled={this.state.disabledModel}  options={this.state.optionsModel}/>
                            <ButtonSearch make={this.state.selectedMake} model={this.state.selectedModel} disabled={this.state.disabledSearch} handleClick={this.handleSearch.bind(this)} />
                        </form>
                        <div id="results"></div>
                        <div id="mobile-message" class="footer mobile-footer bg-info"></div>
                    </div>

                    <div class="col-sm-6 youtube">
                        <div id="youtube-content" class="youtube">
                            <PlayVideo videoId={this.state.playVideoId} />
                        </div>
                        <div id="ad1">
                            <span>Ad Space</span>
                        </div>
                    </div>

                    <div class="col-sm-3">
                        <div id="video-list" class="col video-list">
                            <ListVideos make={this.state.selectedMake} model={this.state.selectedModel} videos={this.state.videos} nextPageToken={this.state.nextPageToken} playVideo={this.playVideo.bind(this)} handleSearch={this.handleSearch.bind(this)}/>
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

