import React, { Component } from 'react';
import Navbar from './Navbar';

class Home extends Component {
	constructor(props) {
        super(props);
        this.state = {
            userCount: null,
            printers: {
            	printerCount: null,
            	availPrinterCount: null,
				downPrinterCount: null
            },
			cameraCount: null,
			pictureCount: null,
			orders: {
            	orderCount: null,
            	waitingCount: null,
            	beingPrintedCount: null,
            	pausedCount: null,
            	canceledCount: null,
            	doneCount: null
            }
        };
    }

    /*
		implementation of idempotent retry design pattern
    */
    fetchForStaff(count, total) {
    	fetch('http://localhost:3001/staff/', {method : 'GET'})
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
                userCount: responseJson.count
            });
        })
        .catch((error) => {
        	console.error(error);
        	if (count < total) {
        		// wait 5 seconds and recall the function
        		setTimeout(() => {
            		this.fetchForStaff(count + 1, total);
            	}, 5000);
        	}
        });
    }

    fetchForPrinter() {
    	fetch('http://localhost:3001/printers/', {method : 'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
               let availPrinterCount = 0;
               let downPrinterCount = 0;
               responseJson.printers.forEach(p => {
               		switch (p.state) {
               			case "AVAILABLE" : 
               				availPrinterCount ++;
               				break;
               			case "DOWN" : 
               				downPrinterCount ++;
               				break;
               			default : return;
               		}
               });
               this.setState({
                    printers: {
                    	printerCount: responseJson.printers.length,
               			availPrinterCount: availPrinterCount,
               			downPrinterCount: downPrinterCount
               		}
               });
            })
            .catch((error) => {
              console.error(error);
            });
    }

    fetchForCamera() {
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
    }

    fetchForPicture() {
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

    fetchForOrder() {
    	fetch('http://localhost:3010/order/', {method : 'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
                let waitingCount = 0;
	            let beingPrintedCount = 0;
	            let pausedCount = 0;
	            let canceledCount = 0;
	            let doneCount = 0;
	            responseJson.forEach(o => {
	            	switch (o.state) {
	           			case "WAITING" : 
	           				waitingCount ++;
	           				break;
	           			case "BEING_PRINTED" : 
	           				beingPrintedCount ++;
	           				break;
	           			case "PAUSED" : 
	           				pausedCount ++;
	           				break;
	           			case "CANCELED" : 
	           				canceledCount ++;
	           				break;
	           			case "DONE" : 
	           				doneCount ++;
	           				break;
	           			default : return;
	           		}
	            });
	            this.setState({
                  orders: {
                  		orderCount: responseJson.length,
                  		waitingCount: waitingCount,
                  		beingPrintedCount: beingPrintedCount,
                  		pausedCount: pausedCount,
                  		canceledCount: canceledCount,
                  		doneCount: doneCount
                  }
               });
            })
            .catch((error) => {
              console.error(error);
            });
    }

    componentDidMount() {
    	this.fetchForPrinter();
		this.fetchForCamera();
		this.fetchForPicture();
		this.fetchForOrder();
		this.fetchForStaff(0, 3);
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
					      	<span className="float-right">{this.state.printers.printerCount}</span>
					      </div>
					      <div>Impressions
					      	<span className="float-right">{this.state.orders.orderCount}</span>
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
					      <div>Imprimantes
					      	<span className="float-right">{this.state.printers.printerCount}</span>
					      </div>
					      <div>&nbsp;&nbsp;-&nbsp;Disponibles
					      	<span className="float-right">{this.state.printers.availPrinterCount}</span>
					      </div>
					      <div>&nbsp;&nbsp;-&nbsp;Indisponibles
					      	<span className="float-right">{this.state.printers.downPrinterCount}</span>
					      </div>
					    </div>
					  </div>

					  <div className="card">
					    <div className="card-body">
					      <h5 className="card-title">Etat des impressions</h5>
					      <div>Impressions
					      	<span className="float-right">{this.state.orders.orderCount}</span>
					      </div>
					      <div>&nbsp;&nbsp;-&nbsp;En attente
					      	<span className="float-right">{this.state.orders.waitingCount}</span>
					      </div>
					      <div>&nbsp;&nbsp;-&nbsp;En cours d'impression
					      	<span className="float-right">{this.state.orders.beingPrintedCount}</span>
					      </div>
					      <div>&nbsp;&nbsp;-&nbsp;Mis en pause
					      	<span className="float-right">{this.state.orders.pausedCount}</span>
					      </div>
					      <div>&nbsp;&nbsp;-&nbsp;Annulée
					      	<span className="float-right">{this.state.orders.canceledCount}</span>
					      </div>
					      <div>&nbsp;&nbsp;-&nbsp;terminée
					      	<span className="float-right">{this.state.orders.doneCount}</span>
					      </div>
					    </div>
					  </div>
					</div>
        		</div>
        	</Navbar>
        );
    }
}

export default Home;