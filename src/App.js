import React from 'react';
import Select from 'antd/lib/select'
import Button from 'antd/lib/button'
import Input from 'antd/lib/input'
import 'antd/lib/select/style/css'
import 'antd/lib/button/style/css'
import 'antd/lib/input/style/css'
import './App.css'
const { Option } = Select
const { TextArea } = Input

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
      transformText: ''
    }
    this.handleViewportChange = this.handleViewportChange.bind(this)
    this.handlePxChange = this.handlePxChange.bind(this)
    this.handleCalculate = this.handleCalculate.bind(this)
  }

  handleCalculate () {
    this.props.calculate(this.state.viewport, this.state.px)
  }

  handleViewportChange (e) {
    this.setState({viewport: e.target.value})
  }

  handlePxChange (e) {
    this.setState({px: e.target.value})
  }
  
  render () {
    return (
      <div className="input-block">
        <Input style={{width: 200}} type="number" onChange={this.handleViewportChange} placeholder="please input your viewport" />
        <Input style={{width: 200}} type="number" onChange={this.handlePxChange} placeholder="please input your px" />
        <Button onClick={this.handleCalculate}>Calculate</Button>
        <FileTransform type="pxToVw"></FileTransform>
      </div>
    )
  }
}

class FileTransform extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      fileName: '',
      originalText: '',
      transformText: ''
    }
    this.handleFileContent = this.handleFileContent.bind(this)
    this.vwTransform = this.vwTransform.bind(this)
    this.pxTransform = this.pxTransform.bind(this)
  }

  handleFileContent () {
    const file = document.getElementById('file')
    const reader = new FileReader()
    file.files[0]
      ? reader.readAsText(file.files[0], 'UTF-8')
      : alert('please upload the css file!')
    reader.onload = event => {
      const content = event.target.result
      this.setState({fileName: file.files[0].name, originalText: content})
    }
  }

  vwTransform () {
    const content = this.state.originalText
    const matchedStr = content.match(/\d*(.?)\d*vw/g)
    const arr = matchedStr.map(item => {
      return `${((item.substring(0, item.length - 2)) * 3.2).toFixed(2)}px`
    })
    const reg = new RegExp(/\d*(.?)\d*vw/)
    let replaceText = ''
    arr.forEach(item => {
      if (replaceText === '') {
        replaceText = content.replace(reg, item)
      } else {
        replaceText = replaceText.replace(reg, item)
      }
    })
    this.setState({transformText: replaceText})
  }

  pxTransform () {
    const content = this.state.originalText
    const matchedStr = content.match(/\d*(.?)\d*px/g)
    const arr = matchedStr.map(item => {
      return `${((item.substring(0, item.length - 2)) / 3.2).toFixed(2)}vw`
    })
    const reg = new RegExp(/\d*(.?)\d*px/)
    let replaceText = ''
    arr.forEach(item => {
      if (replaceText === '') {
        replaceText = content.replace(reg, item)
      } else {
        replaceText = replaceText.replace(reg, item)
      }
    })
    this.setState({transformText: replaceText})
  }

  render () {
    return (
      <div className="file-container">
        <p className="sub-title">Or you can upload the css file to transform the whole file</p>
        <div className="file-transform">
          <a href="javascript:;" className="file">select the css file
            <input type="file" id="file" onChange={this.handleFileContent}></input>
          </a>
          <span>{this.state.fileName}</span>
          <Button onClick={this.props.type === 'pxToVw' ? this.pxTransform : this.vwTransform}>transform</Button>
          <TextArea
            placeholder="The transform file text"
            style={{width: 300}}
            value={this.state.transformText}
            autosize={{ minRows: 2, maxRows: 6 }}
          />
        </div>
      </div>
    )
  }
}

class VwToPx extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      viewport: '', 
      vw: ''
    }
    this.handleViewportChange = this.handleViewportChange.bind(this)
    this.handleVwChange = this.handleVwChange.bind(this)
    this.handleCalculate = this.handleCalculate.bind(this)
  }
  
  handleCalculate () {
    this.props.calculate(this.state.viewport, this.state.vw)
  }

  handleViewportChange (e) {
    this.setState({viewport: e.target.value})
  }
  
  handleVwChange (e) {
    this.setState({vw: e.target.value})
  }

  render () {
    return (
      <div className="input-block">
        <Input style={{width: 200}} type="number" onChange={this.handleViewportChange} placeholder="please input your viewport" />
        <Input style={{width: 200}} type="number" onChange={this.handleVwChange} placeholder="please input your vw" />
        <Button onClick={this.handleCalculate}>Calculate</Button>
        <FileTransform type="vwTransform"></FileTransform>
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

  handleVwResult (viewport, px) {
    const result = `${px / (viewport / 100)}vw`
    this.setState({result: result})
  }

  handlePxResult (viewport, vw) {
    const result = `${vw * (viewport / 100)}px`
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
