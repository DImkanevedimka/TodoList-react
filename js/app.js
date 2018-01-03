'use strict';

var Newtodos = [
  {
    list: 'test'
  },
  {
    list: 'test1'
  },
  {
    list: 'test2'
  }
];

window.ee = new EventEmitter();

var Todo = React.createClass({

  getInitialState: function() {
    return {
      isReady: false
    }
  },

  isReadyClick: function(){
    this.setState({isReady: !this.state.isReady});
  },
  
  render: function() {
    return (
      <div className='ToDo_item'>
      <div className="cheked" onClick={this.isReadyClick}/>
      <p className={'new_todo ' + (this.state.isReady ? 'yes':'')}>{this.props.data.list}</p>
      </div>
    )
  }
});



var Todoes = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired
  },
  
    
  render: function() {
    var data = this.props.data;
    var newsTemplate;
    var kindex = data.length+1;
    if (data.length > 0) {
      newsTemplate = data.map(function(item) {
        kindex-- 
        return (
          <div >
          <Todo  key={kindex} data={item} />
          </div>
        )
      })
    } else {
      return
    }
    
    return (
      <div className='Todo_all'>
      {newsTemplate}
      <p
      className={'news__count ' + (data.length > 0 ? '':'none') }>{data.length} item left</p>
      </div>
    );
  }
});

var Add = React.createClass({
  
  onBtnClickHandler: function(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      var textEl = ReactDOM.findDOMNode(this.refs.text);
      var text = textEl.value;
      
      var item = [{
        list: text
      }];
      
      window.ee.emit('test', item);
      
      textEl.value = '';
      this.setState({textIsEmpty: true});
    }
  },
  
    
  render: function() {
    return (
      <form className='add cf'>
      <input
      type='text'
      className='add__todo'
      onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
      placeholder='What needs to be done?'
      ref='text'
      onKeyDown={this.onBtnClickHandler}
      />
      </form>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      news: Newtodos
    };
  },
  
  componentDidMount: function() {
    var self = this;
    window.ee.addListener('test', function(item) {
      var nextNews = item.concat(self.state.news);
      self.setState({news: nextNews});
    });
  },
  
  componentWillUnmount: function() {
    window.ee.removeListener('test');
  },
  
  render: function() {
    console.log('render');
    return (
      <div className='app'>
      <h1>todos</h1>
      <Add />
      <Todoes data={this.state.news} />
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);