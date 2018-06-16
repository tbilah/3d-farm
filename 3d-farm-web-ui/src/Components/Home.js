import React, { Component } from 'react';
import Navbar from './Navbar';

class Home extends Component {
	constructor(props) {
        super(props);
        this.state = {
            userCount: null,
			printerCount: null,
			availPrinterCount: null,
			downPrinterCount: null,
			cameraCount: null,
			pictureCount: null
        };
    }

    componentDidMount() {
        fetch('http://localhost:3001/staff/', {method : 'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
               this.setState({
                  userCount: responseJson.count
               });
            })
            .catch((error) => {
              console.error(error);
            });

        fetch('http://localhost:3001/printers/', {method : 'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
               this.setState({
                  printerCount: responseJson.count
               });

               let availPrinterCount = 0;
               let downPrinterCount = 0;
               responseJson.printers.map(p => {
                  if (p.state === "AVAILABLE") {
                  	 availPrinterCount ++;
                  } else if (p.state === "DOWN") {
                  	 downPrinterCount ++;
                  }
               });
               this.setState({
                  availPrinterCount: availPrinterCount
               });
               this.setState({
                  downPrinterCount: downPrinterCount
               });
            })
            .catch((error) => {
              console.error(error);
            });

        fetch('http://localhost:3002/cameras/', {method : 'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
               this.setState({
                  cameraCount: responseJson.count
               });
            })
            .catch((error) => {
              console.error(error);
            });

        fetch('http://localhost:3002/pictures/', {method : 'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
               this.setState({
                  pictureCount: responseJson.count
               });
            })
            .catch((error) => {
              console.error(error);
            });
    }

    render() {
        return (
        	<Navbar>
        		<div className="container-fluid">
        			<div className="card-columns">
					  <div className="card">
					    <div className="card-body">
					      <h5 className="card-title">Statistiques</h5>
					      <div>Utilisateurs
					      	<span className="float-right">{this.state.userCount}</span>
					      </div>
					      <div>Imprimantes
					      	<span className="float-right">{this.state.printerCount}</span>
					      </div>
					      <div>&nbsp;&nbsp;-&nbsp;Disponibles
					      	<span className="float-right">{this.state.availPrinterCount}</span>
					      </div>
					      <div>&nbsp;&nbsp;-&nbsp;Indisponibles
					      	<span className="float-right">{this.state.downPrinterCount}</span>
					      </div>
					      <div>Caméras
					      	<span className="float-right">{this.state.cameraCount}</span>
					      </div>
					      <div>Photos
					      	<span className="float-right">{this.state.pictureCount}</span>
					      </div>
					    </div>
					  </div>

					  <div className="card">
					    <div className="card-body">
					      <h5 className="card-title">Etat du système</h5>
					      
					    </div>
					  </div>

					  
					</div>
        		</div>
        	</Navbar>
        );
    }
}

export default Home;