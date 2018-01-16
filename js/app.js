'use strict';


class Todo extends React.Component {

  render() {
    var data = this.props.data
    var remove;
    return (
      <li className={'ToDo_item '+ (this.props.data.ready ? 'completed':'')}>
      <div className={"cheked "+ (this.props.data.ready ? 'ready':'')} onClick={() => {this.props.changeReady(data.id, !data.Ready)}}/>
      <span className={'delete'} onClick={() => {this.props.remove(data.id)}}>x</span>
      <p className={'new_todo'}>{data.text}</p>
      </li>
    );
  }
}


const Todoes = ({data,remove,changeReady}) => {
  
  const todoTemplate = data.map((todo) => {
    return (<Todo key={todo.id} data={todo} remove={remove} changeReady={changeReady}/>)
  });
  
  return (
    <ul className='Todo_all'>
    {todoTemplate}
    <div
    className={'news__count ' + (data.length > 0 ? '':'none') }>
    <div>{data.length} items</div>
    <a href='#'>All</a>
    <a href='#'>Active</a>
    <a href='#'>completed</a>
    </div>
    </ul>
  )
}


const Add = ({addTodo}) => {
  let input;
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      addTodo(input.value);
      input.value = '';
    }}>
    <input className="add__todo"
    placeholder='What needs to be done?'
    ref={node => {
      input = node;
    }} />
    </form>
  );
};

window.id = 0;

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: []
    }
    
    this.apiUrl = '//5a588c860409b00012ffe67d.mockapi.io/todos'
  };
  
  componentDidMount() {
    var self = this;
    axios.get(this.apiUrl)
    .then((res) => {
      
      this.setState({data:res.data});
    });
  }
  
  addTodo2(val){
    const todo = {text: val};
    axios.post(this.apiUrl, todo)
    .then((res) => {
      this.state.data.push(res.data);
      this.setState({data: this.state.data});
    });
  }
  
  changeReady(id, val){
    console.log(id, val);
    var data=this.state.data
    // for (let i=0; i<data.length;i++){
    //   axios.delete(this.apiUrl+'/'+data[i].id)
    // }
  
    const remainder = data.filter((todo) => {
      if(todo.id !== id) {
        console.log(todo)
        return todo
      } else {
        todo.ready = !todo.ready;
        console.log(todo)
        return todo
      }});

      for (let i=0; i<data.length;i++){
        console.log(data.length + " eto i:" + data[i].id)
      axios.delete(this.apiUrl+'/'+ data[i].id)
    }

      // for(let i=0; i<remainder.length;i++){
      //   axios.post(this.apiUrl, remainder[i])
      // }

      this.setState({data: remainder});       
  }
  
  handleRemove(id){
    const remainder = this.state.data.filter((todo) => {
      if(todo.id !== id) return todo;
    });
    
    axios.delete(this.apiUrl+'/'+id)
    .then((res) => {
      this.setState({data: remainder});      
    })
  }
  
  render() {
    console.log('render');
    return (
      <div className='app'>
      <h1>Todos</h1>
      <Add addTodo={this.addTodo2.bind(this)}/>
      <Todoes 
      changeReady= {this.changeReady.bind(this)}
      data={this.state.data}
      remove={this.handleRemove.bind(this)}
      />
      </div>
    );
  }
};


ReactDOM.render(
  <App />,
  document.getElementById('root')
);