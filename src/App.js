import React from 'react';
import logo from './logo.svg';

import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import './App.css';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import diagramXML from './resources/newDiagram.bpmn';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
export default class ReactBpmn extends React.Component {

  constructor(props) {
    super(props);

    this.state = { };

    this.containerRef = React.createRef();
  }

  componentDidMount() {

    const {
      url
    } = this.props;

    const container = this.containerRef.current;

    this.bpmnViewer = new BpmnModeler({ container });
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">
      <bpmn2:process id="Process_1" isExecutable="false">
        <bpmn2:startEvent id="StartEvent_1"/>
      </bpmn2:process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
          <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
            <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>
          </bpmndi:BPMNShape>
        </bpmndi:BPMNPlane>
      </bpmndi:BPMNDiagram>
    </bpmn2:definitions>`
    this.bpmnViewer.importXML(xml, function(err) {

      if (err) {
        // container
        //   .removeClass('with-diagram')
        //   .addClass('with-error');
  
        // container.find('.error pre').text(err.message);
  
        console.error(err);
      } else {
        // container
        //   .removeClass('with-error')
        //   .addClass('with-diagram');
      }
    });

    this.bpmnViewer.on('import.done', (event) => {
      const {
        error,
        warnings
      } = event;

      if (error) {
        return this.handleError(error);
      }

      this.bpmnViewer.get('canvas').zoom('fit-viewport');

      return this.handleShown(warnings);
    });

    this.fetchDiagram(url);
  }

  componentWillUnmount() {
    this.bpmnViewer.destroy();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      props,
      state
    } = this;

    if (props.url !== prevProps.url) {
      return this.fetchDiagram(props.url);
    }

    if (state.diagramXML !== prevState.diagramXML) {
      return this.bpmnViewer.importXML(state.diagramXML);
    }
  }

  fetchDiagram(url) {

    this.handleLoading();

    fetch(url)
      .then(response => response.text())
      .then(text => this.setState({ diagramXML: text }))
      .catch(err => this.handleError(err));
  }

  handleLoading() {
    const { onLoading } = this.props;

    if (onLoading) {
      onLoading();
    }
  }

  handleError(err) {
    const { onError } = this.props;

    if (onError) {
      onError(err);
    }
  }

  handleShown(warnings) {
    const { onShown } = this.props;

    if (onShown) {
      onShown(warnings);
    }
  }

  render() {
    return (
      <div>
      {/* <div className="react-bpmn-diagram-container" ref={ this.containerRef }></div> */}
      <div className="content" id="js-drop-zone" ref={ this.containerRef }>



        <div className="message error">
          <div className="note">
            <p>Ooops, we could not display the BPMN 2.0 diagram.</p>

            <div className="details">
              <span>cause of the problem</span>
              <pre></pre>
            </div>
          </div>
        </div>

        <div className="canvas" id="js-canvas"></div>
        </div>

        <ul className="buttons">
        <li>
          <button onClick={() => {this.bpmnViewer.get('canvas').zoom('fit-viewport');}}>gwwfwfw</button>
          download
        </li>
        <li>
          <a id="js-download-diagram" >
            BPMN diagram
          </a>
        </li>
        <li>
          <a id="js-download-svg" >
            SVG image
          </a>
        </li>
        </ul>
      </div>
    );
  }
}
