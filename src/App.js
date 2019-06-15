import React from 'react';
import Select from 'antd/lib/select'
import Button from 'antd/lib/button'
import Input from 'antd/lib/input'
import message from 'antd/lib/message'
import 'antd/lib/select/style/css'
import 'antd/lib/button/style/css'
import 'antd/lib/input/style/css'
import 'antd/lib/message/style/css'
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
        <FileTransform type="pxToVw" viewport={this.state.viewport}></FileTransform>
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
        <FileTransform type="vwToPx" viewport={this.state.viewport}></FileTransform>
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
    this.transform = this.transform.bind(this)
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

  transform () {
    if (this.props.viewport === '' || this.state.originalText === '') {
      message.error('Please make sure the values in the input box are entered.')
      return
    }
    const content = this.state.originalText
    let matchedStr, arr, reg
    if (this.props.type === 'vwToPx') {
      matchedStr = content.match(/\d*(.?)\d*vw/g)
      arr = matchedStr.map(item => {
        return `${((item.substring(0, item.length - 2)) * (this.props.viewport / 100)).toFixed(2)}px`
      })
      reg = new RegExp(/\d*(.?)\d*vw/)
    } else {
      matchedStr = content.match(/\d*(.?)\d*px/g)
      arr = matchedStr.map(item => {
        return `${((item.substring(0, item.length - 2)) / (this.props.viewport / 100)).toFixed(2)}vw`
      })
      reg = new RegExp(/\d*(.?)\d*px/)
    }
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
          <Button onClick={this.transform}>transform</Button>
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
    if (viewport === '' || px === '') {
      this.setState({isMissing: true})
      message.error('Please make sure the values in the input box are entered.');
      return
    }
    const result = `${px / (viewport / 100)}vw`
    this.setState({result: result})
  }

  handlePxResult (viewport, vw) {
    if (viewport === '' || vw === '') {
      this.setState({isMissing: true})
      message.error('Please make sure the values in the input box are entered.');
      return
    }
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
