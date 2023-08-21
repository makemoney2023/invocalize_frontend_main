import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'

import {
	CheckIcon,
	UserIcon,
	LockClosedIcon,
} from '@heroicons/react/outline'
import {
	Switch,
	Route,
	withRouter, Redirect
} from "react-router-dom";
import { Helmet } from "react-helmet";
import { observable, makeObservable, } from 'mobx'

import { observer, inject } from 'mobx-react'
import CryptoHelper from '../Helper/CryptoHelper'
import logo from '../listy_logo.png'

@inject('store')
@observer
class Login extends Component {


	@observable email = ""
	@observable password = ""
	@observable fname = ""
	@observable lname = ""
	@observable errorMessage = ""

	constructor() {
		super()
		makeObservable(this)
	}

	onChange = (val) => {
		this.currentPromptOption = val
		console.log(this.currentPromptOption)
	}

	onChangeAny = (val, attr) => {
		this[attr] = val
		this.errorMessage = ""
	}

	onLogin = async (e) => {
		try {
			e.preventDefault()
			let data = await this.props.store.api.post('/auth/signin', {
				email: this.email,
				password: CryptoHelper.encrypt(this.password),
			}).then(({ data }) => data)
			this.props.store.loginWithDataTokenAndProfile(data)
		} catch (err) {
			console.log(err)
			console.log(err?.response?.data?.message)
			if (err?.response?.data?.message) {
				this.errorMessage = err?.response?.data?.message
			}
		}
	}

	onSignup = async (e) => {
		try {
			e.preventDefault()
			this.errorMessage = ""
			console.log('signup')
			let data = await this.props.store.api.post('/auth/signup', {
				email: this.email,
				password: CryptoHelper.encrypt(this.password),
				fname: this.fname,
				lname: this.lname,
				referral: this.props.store.referral
			}).then(({ data }) => data)
			if (data.token && data.profile) {
				this.props.store.loginWithDataTokenAndProfile(data)
			}
		} catch (err) {
			console.log(err)
			console.log(err?.response?.data?.message)
			if (err?.response?.data?.message) {
				this.errorMessage = err?.response?.data?.message
			}
		}
	}

	// Currently Selected Input Option

	render() {
		return (
			<>
				<Helmet>
					<title>{`Login - Listy.ai`}</title>
				</Helmet>
				<div className="container mx-auto lg:px-4 py-4 min-h-screen flex flex-col md:items-center md:justify-center">

					<div className="text-center mb-6">
						<Logo />
						<div className="text-3xl md:text-5xl relative font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-600 mb-4">Listy.ai<span className="font-normal "></span>
						{/* <div className="absolute top-0 ml-3 left-full bg-gradient-to-br from-gray-500 to-gray-500 text-white text-sm px-2 py-0.5 rounded-md font-normal hidden md:flex">ai</div> */}
						</div>
					</div>
					<div className={`min-w-full md:min-w-0 bg-white rounded-xl shadow-xl transform transition-all  transition shadow-md hover:shadow-2xl focus:shadow-2xl w-1/2`}>
						<div className="align-bottom flex  transform transition-all sm:align-middle transition flex divide-x divide-gray-300 ">
							<NavLink to="/login" className={`flex-1 justify-center transition py-4 px-4 pr-8 rounded-t-md flex text-${this.props.location.pathname === "/login" ? "gray-800" : "gray-600"} font-medium  bg-${this.props.location.pathname === "/login" ? "white" : "gray-300"} hover:bg-${this.props.location.pathname === "/login" ? "white" : "gray-100"} cursor-pointer`} >
								<div className={`transition mr-4  flex-shrink-0 inline-flex items-center justify-center text-sm h-6 w-6 rounded-full bg-${this.props.location.pathname === "/login" ? "green-300" : "gray-200"} text-${this.props.location.pathname === "/login" ? "green" : "gray"}`}>
									<CheckIcon className={`transition h-4 w-4 text-${this.props.location.pathname === "/login" ? "green-600" : "gray-400"}`} aria-hidden="true" />
								</div>
								Login
							</NavLink>
							<NavLink to="/signup" className={`flex-1 justify-center transition py-4 px-4 pr-8 rounded-t-md flex text-${this.props.location.pathname === "/signup" ? "gray-800" : "gray-600"} font-medium  bg-${this.props.location.pathname === "/signup" ? "white" : "gray-300"} hover:bg-${this.props.location.pathname === "/signup" ? "white" : "gray-100"} cursor-pointer`} >
								<div className={`transition mr-4  flex-shrink-0 inline-flex items-center justify-center text-sm h-6 w-6 rounded-full bg-${this.props.location.pathname === "/signup" ? "green-300" : "gray-200"} text-${this.props.location.pathname === "/signup" ? "green" : "gray"}`}>
									<CheckIcon className={`transition h-4 w-4 text-${this.props.location.pathname === "/signup" ? "green-600" : "gray-400"}`} aria-hidden="true" />
								</div>
								Signup
							</NavLink>
						</div>
						<div className="px-4 py-4 md:px-12 md:py-12">
							{/* Sorru */}
							<Switch>
								<Route path="/login" >
									<Logon
										landingPageUrl={this.props.store.landingPageUrl}
										email={this.email}
										password={this.password}
										signUp={this.signUpWithGoogle}
										onChange={this.onChangeAny}
										onLogin={this.onLogin} />
								</Route>
								<Route path="/signup"  >
									<Signup
										email={this.email}
										password={this.password}
										fname={this.fname}
										lname={this.lname}
										onChange={this.onChangeAny}
										onSignup={this.onSignup}
									/>
								</Route>
								<Route >
									<Redirect to="/login" />
								</Route>
							</Switch>
							{this.errorMessage ? <div className="text-red-600 bg-red-50 rounded-md p-1 text-center mt-4">
								{this.errorMessage}
							</div> : null}
						</div>
						<a href={`https://www.app.listy.homes/`} className="block text-center bg-gray-100 text-gray-500 text-sm p-3 rounded-b-lg hover:bg-gray-200 cursor-pointer">
							Back to landing page
						</a>
					</div>
				</div>
			</>)
	}
}

const Logon = observer(({ active, email, password, onChange, onLogin, landingPageUrl, signUp }) => {
	return (
		<>
			<form onSubmit={onLogin}>
				<div className={`mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-${(email && password) ? "green" : "gray"}-300  ${(email && password) ? "bg-green-300" : "bg-gray-300"} `}>
					<LockClosedIcon className={`h-8 w-8 ${active ? "text-green-700" : "text-gray-500"} text-${(email && password) ? "green-700" : "gray-500"}`} aria-hidden="true" />
				</div>
				<div className="mt-3 text-center ">
					<div className="text-3xl font-medium text-gray-900">
						Log in
					</div>
					<p className="text-lg text-gray-500">
						Login to your account
					</p>
					<div className="flex flex-col flex-1">
						<label className="text-gray-400 text-sm block mt-4 inline-block text-left">Email Address</label>
						<input value={email} onChange={e => onChange(e.target.value, 'email')} focus="true" type="email" className="rounded-md text-lg px-4 py-2  border border-gray-300 " placeholder="john@smith.com" />
					</div>
					<div className="flex flex-col flex-1">
						<label className="text-gray-400 text-sm block mt-4 inline-block text-left">Password</label>
						<input value={password} onChange={e => onChange(e.target.value, 'password')} type="password" className="rounded-md text-lg px-4 py-2  border border-gray-300 inline-block" placeholder="*******" />
					</div>
					<div className="flex flex-col">
						<button type="submit" className="hover:bg-gray-600 font-medium rounded-lg text-lg px-4 py-2 bg-gray-500 text-white mt-4 border border-gray-300 inline-block" >
							Log in
						</button>
						{/* <div onClick={signUp} className="hover:bg-gray-600 font-medium rounded-lg text-lg px-4 py-2 bg-gray-500 text-white mt-4 border border-gray-300 inline-block" >
						signUp Google
						</div>
						 */}
						<a href={`https://www.openaitemplate.ai/contact`} className="mt-4 text-gray-400 text-sm">Forgot your password?</a>
					</div>
				</div>
			</form>
		</>
	)
})

const Signup = observer(({ active, email, password, fname, lname, onChange, onSignup }) => {
	return (
		<>
			{/* onSignup */}
			<form onSubmit={onSignup}>
				<div className={`mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-${email && password ? "green" : "gray"}-300  ${email && password ? "bg-green-300" : "bg-gray-300"} `}>
					<UserIcon className={`h-8 w-8 ${active ? "text-green-700" : "text-gray-500"} text-${email && password ? "green-700" : "gray-500"}`} aria-hidden="true" />
				</div>
				<div className="mt-3 text-center ">
					<div className="text-3xl font-medium text-gray-900">
						Sign Up
					</div>
					<p className="text-lg text-gray-500">
						Create your account
					</p>
					<div className="md:flex">
						<div className="flex flex-col min-w-0 md:pr-2 flex-1">
							<label className="text-gray-400 text-sm block mt-4 inline-block text-left">First Name</label>
							<input value={fname} onChange={e => onChange(e.target.value, 'fname')} type="text" className="rounded-md text-lg px-4 py-2  border border-gray-300 inline-block w-auto" placeholder="John" />
						</div>
						<div className="flex flex-col min-w-0 md:pl-2 flex-1">
							<label className="text-gray-400 text-sm block mt-4 inline-block text-left">Last Name</label>
							<input value={lname} onChange={e => onChange(e.target.value, 'lname')} type="text" className="rounded-md text-lg px-4 py-2  border border-gray-300 inline-block w-auto" placeholder="Smith" />
						</div>
					</div>
					<div className="flex flex-col">
						<label className="text-gray-400 text-sm block mt-4 inline-block text-left">Email Address</label>
						<input value={email} onChange={e => onChange(e.target.value, 'email')} focus="true" type="email" className="rounded-md text-lg px-4 py-2  border border-gray-300 " placeholder="john@smith.com" />
					</div>
					<div className="flex flex-col">
						<label className="text-gray-400 text-sm block mt-4 inline-block text-left">Password</label>
						<input value={password} onChange={e => onChange(e.target.value, 'password')} type="password" className="rounded-md text-lg px-4 py-2  border border-gray-300 inline-block" placeholder="*******" />
					</div>

					<div className="flex flex-col">
						<button type="submit" className="hover:bg-green-600 bg-green-500 font-medium rounded-lg text-lg px-4 py-2 bg-gray-200 text-white mt-4 border border-gray-300 inline-block" >
							Sign Up
						</button>
					</div>
				</div>
			</form>
		</>
	)
})


const Logo = () => (
	<img src={logo} width={120} height={100} />
)



export default withRouter(Login)