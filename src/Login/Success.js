
import React, { Component } from 'react';

import { withRouter , Redirect } from "react-router-dom";
import Loading from '../Components/Loader'
import { observable, makeObservable, } from 'mobx'
import { observer, inject } from 'mobx-react'
import logo from '../listy_logo.png'
@inject('store')
@observer
class Login extends Component {

	
	@observable loading = true
	
	constructor(props){
		super(props)
		makeObservable(this)
		
	}
	componentDidMount(){
		this.refresh = setInterval(() => {
			this.props.store.refreshTokenAndProfile();
			if(this.props.store.profile.status){
				this.loading = false
			}
		}, 1000);
	}
	componentWillUnmount(){
		clearInterval(this.refresh)
	}
	
	render() {
	return (
		<>
			{this.loading ? null : <Redirect to="/" />}
			<div className="container mx-auto lg:px-4 py-4 min-h-screen flex flex-col md:items-center md:justify-center">

				<div className="text-center mb-6">
					<Logo />
					<div>
						<div className="text-4xl font-bold text-gray-700">sub<span className="text-green-600 font-medium">editor</span><span className="text-gray-500 font-normal ">.ai</span></div>
					</div>
				</div>
			<div className={`min-w-full md:min-w-0 bg-white rounded-xl shadow-xl transform transition-all  transition shadow-md hover:shadow-2xl focus:shadow-2xl w-1/2`}>
			
              <div className="px-4 py-8 text-center">
              		<Loading className="w-24 h-24" active />
                </div>
               	 <div className="text-center ">
                    <div className="text-3xl font-medium text-gray-900">
                    	Generating Your Profile
                    </div>
					<p className="text-lg text-gray-500">
						1. Preparing your credits
					</p>
					
					<div className="flex flex-col p-4">
						<div className="font-medium rounded-lg text-lg px-4 py-4 bg-gray-300 text-white mt-4 border border-gray-300 inline-block" >
							Nearly Done...
						</div>
					</div>
                    </div>
			  </div>
			</div>
		
		</>)
		}
  }



  const Logo = () => (
	<img src={logo} width={120} height={100} />
  )



export default withRouter(Login)