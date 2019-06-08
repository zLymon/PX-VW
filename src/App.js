import React from 'react';
import Select from 'antd/lib/select'
import Button from 'antd/lib/button'
import Input from 'antd/lib/input'
import 'antd/lib/select/style/css'
import 'antd/lib/button/style/css'
import 'antd/lib/input/style/css'
import './App.css'
const { Option } = Select

class Myselect extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (value) {
    this.props.onTypeChange(value)
  }

  render () {
    return (
      <Select 
        defaultValue="Please select the transform type"
        className="select-item" 
        style={{width: 300}}
        onChange={this.handleChange}
      >
        <Option key="0" value="pxToVw">px to vw</Option>
        <Option key="1" value="vwToPx">vw to px</Option>
      </Select>
    )
  }
}

class PxToVw extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      viewport: '', 
      px: '', 
      multiple: ''
    }
    this.handleViewportChange = this.handleViewportChange.bind(this)
    this.handlePxChange = this.handlePxChange.bind(this)
    this.handleCalculate = this.handleCalculate.bind(this)
    this.hanldeMultipleChange = this.hanldeMultipleChange.bind(this)
  }

  handleCalculate () {
    this.props.calculate(this.state.viewport, this.state.px, this.state.multiple)
  }
  handleViewportChange (e) {
    this.setState({viewport: e.target.value})
  }

  handlePxChange (e) {
    this.setState({px: e.target.value})
  }
  hanldeMultipleChange (value) {
    this.setState({multiple: value})
  }
  
  render () {
    return (
      <div className="input-block">
        <Select
          defaultValue="Please select the multiple of your design draft"
          style={{width: 300}}
          onChange={this.hanldeMultipleChange}
        >
          <Option key="0" value="1">1x</Option>
          <Option key="1" value="2">2x</Option>
          <Option key="2" value="4">4x</Option>
        </Select>
        <Input style={{width: 200}} type="number" onChange={this.handleViewportChange} placeholder="please input your viewport" />
        <Input style={{width: 200}} type="number" onChange={this.handlePxChange} placeholder="please input your px" />
        <Button onClick={this.handleCalculate}>Calculate</Button>
      </div>
    )
  }
}

class VwToPx extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      viewport: '', 
      vw: '',
      multiple: ''
    }
    this.handleViewportChange = this.handleViewportChange.bind(this)
    this.handleVwChange = this.handleVwChange.bind(this)
    this.handleCalculate = this.handleCalculate.bind(this)
    this.hanldeMultipleChange = this.hanldeMultipleChange.bind(this)
  }
  
  handleCalculate () {
    this.props.calculate(this.state.viewport, this.state.vw, this.state.multiple)
  }
  handleViewportChange (e) {
    this.setState({viewport: e.target.value})
  }
  handleVwChange (e) {
    this.setState({vw: e.target.value})
  }
  hanldeMultipleChange (value) {
    this.setState({multiple: value})
  }

  render () {
    return (
      <div className="input-block">
        <Select
          defaultValue="Please select the multiple of your design draft"
          style={{width: 300}}
          onChange={this.hanldeMultipleChange}
        >
          <Option key="0" value="1">1x</Option>
          <Option key="1" value="2">2x</Option>
          <Option key="2" value="4">4x</Option>
        </Select>
        <Input style={{width: 200}} type="number" onChange={this.handleViewportChange} placeholder="please input your viewport" />
        <Input style={{width: 200}} type="number" onChange={this.handleVwChange} placeholder="please input your vw" />
        <Button onClick={this.handleCalculate}>Calculate</Button>
      </div>
    )
  }
}

class App extends React.Component {
  constructor (props) {
    super(props)
    this.handleTypeChange = this.handleTypeChange.bind(this)
    this.handlePxResult = this.handlePxResult.bind(this)
    this.handleVwResult = this.handleVwResult.bind(this)
    this.state = {
      transformType: '',
      result: ''
    }
  }

  handleTypeChange (value) {
    this.setState({
      transformType: value,
      result: ''
    })
  }

  handleVwResult (viewport, px, multiple) {
    const result = `${px / ((viewport / multiple) / 100)}vw`
    this.setState({result: result})
  }

  handlePxResult (viewport, vw, multiple) {
    const result = `${vw * ((viewport / multiple) / 100)}px`
    this.setState({result: result})
  }

  render () {
    let input = ''
    let result = ''
    if (this.state.transformType === 'pxToVw') {
      input = <PxToVw calculate={this.handleVwResult} />
    } else if (this.state.transformType === 'vwToPx') {
      input = <VwToPx calculate={this.handlePxResult} />
    }
    if (this.state.result !== '') {
      result = <p className="result">{this.state.result}</p>
    }
    return (
      <div className="app">
        <header>
          <h1 className="title">A tool for transform between px and vw</h1>
        </header>
        <main>
          <Myselect
            onTypeChange={this.handleTypeChange}
          />
          { input }
          { result }
        </main>
      </div>
    )
  }
}

export default App;
