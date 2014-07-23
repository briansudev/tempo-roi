// System character //

var num_routes = 1, // R
	route_length = 20, // L km
	num_termini = 2, // n
	avg_pass_dist = 5, // l; km
	pass_ridership = 438000, // D
	op_hours = 14, // H
	shift_dur = 8; // C

// System operation //

// Operator Decisions
var num_buses = 14, // M
	num_buses_ = 14, // M*
	num_bus_deps = 157, // T
	num_bus_deps_ = 147, // T*
	driver_break_time = 0.201, // B
	driver_break_time_ = 0.201; //B*

// Performance Inputs
var speed = 13, // v
	speed_ = 13, // v*
	punc_dev = .05, // s
	punc_dev_ = .025, // s*
	serv_int_dev = .05, // S
	serv_int_dev_ = .03333; // S*

// Valuation Inputs //

var pass_time_sav = 10, // a_p; Default $10/pax-hr
	pass_wait_time_sav = 20, // a_w; Default $20/pax-hr
	bus_capt_cost = 5000, // a_m; Default $5000/bus-yr
	bus_opt_cost = 20000, // a_b; Default $20000/bus-yr
	drv_shift_cost = 60000, // a_l; Default = $60000/shift-yr
	drv_inc_break = 10, // a_d; Default $10/hr
	rm_uncert_drv_rest = 5, // a_r; Default $5/hr
	elm_hour_bus_runtime = 5; // a_e; Default $5/hr

// Costs //

var tempo_cost = 7000, // a
	tempo_repl_act_cost = 0; // a_o;; Default $0/yr

// Dictionary for all variables
var d;
$(function() {
	updateD();
});

function updateD() {
	d = {
	'R': num_routes,
	'L': route_length,
	'n': num_termini,
	'l': avg_pass_dist,
	'D': pass_ridership,
	'H': op_hours,
	'C': shift_dur,
	'M': num_buses,
	'M*': num_buses_,
	'T': num_bus_deps,
	'T*': num_bus_deps_,
	'B': driver_break_time,
	'B*': driver_break_time_,
	'v': speed,
	'v*': speed_,
	's': punc_dev,
	's*': punc_dev_,
	'S': serv_int_dev,
	'S*': serv_int_dev_,
	'a_p': pass_time_sav,
	'a_w': pass_wait_time_sav,
	'a_m': bus_capt_cost,
	'a_b': bus_opt_cost,
	'a_l': drv_shift_cost,
	'a_d': drv_inc_break,
	'a_r': rm_uncert_drv_rest,
	'a_e': elm_hour_bus_runtime,
	'a': tempo_cost,
	'a_o': tempo_repl_act_cost,
	'X_b': red_bus_op,
	'X_by': red_bus_op_year,
	'X_d': inc_drv_break_hours,
	'X_w': red_pass_hours_waited,
	'X_p': red_pass_hours_riding_time,
	'X_c': red_num_drv_hours_wasted_relieving_drivers,
	'X_r': red_hours_uncertain_break_times,
	'X_m': red_num_buses_sim_op,
	'b1': b1,
	'b2': b2,
	'b3': b3,
	'b4': b4,
	'b5': b5,
	'b6': b6,
	'b7': b7,
	'op_roi': an_op_roi,
	'ovr_roi': an_ovr_roi,
	};
}

// Info dictionary

var info = {
	'R': 'Number of Routes using Tempo',
	'L': 'Route Length',
	'n': 'Number of termini where drivers take their rest',
	'l': 'Length of a passenger trip',
	'D': 'Passenger Ridership',
	'H': 'Hours of Operation',
	'C': 'Shift Duration',
	'M': 'Number of Buses (before)',
	'M*': "Number of Buses (after)",
	'T': "Number of bus departures from the route's first terminus (before)",
	'T*': "Number of bus departures from the route's first terminus (after)",
	'B': "Driver break time per cycle (before)",
	'B*': "Driver break time per cycle (after)",
	'v': "Commercial speed (before)",
	'v*': "Commercial speed (after)",
	's': "Punctuality Deviation (before)",
	's*': "Punctuality Devation (after)",
	'S': "Service Interval Deviations (before)",
	'S*': "Service Interval Deviations (after)",
	'a_p': "Valuation in $ of one hour saved of passenger riding time",
	'a_w': "Valuation in $ of one hour saved of passenger waiting time",
	'a_m': "Capital cost in $/year of a bus",
	'a_b': "Operating cost in $/year of a bus",
	'a_l': "Average cost in $/year of staffing a drivers' shift for a year",
	'a_d': "Value placed on one hour of increased break time for drivers",
	'a_r': "Value in removing 1 hour of uncertainty from driver rest",
	'a_e': "Value placed on the societal benefits of eliminating 1 hour of bus running time",
	'a': " Yearly cost of Tempo for the route ($/year)",
	'a_o': "Yearly cost of all activities Tempo would replace",
	'X_b': "Reduction in bus-hours of operation per year",
	'X_d': "Increased hours of driver breaks per year",
	'X_w': "Reduction in passenger-hours waited per year",
	'X_p': "Reduction in passenger hours of riding time per year",
	'X_c': "Reduction in number of driver hours wasted relieving drivers",
	'X_r': "Reduction in hours of uncertain break times",
	'X_m': "Reduction in the number of buses simultaneously operatored",
	'X_by': "Reduction in bus-hours of operation per year",
	'b1': "Reduction in operator costs (IT)",
	'b2': "Reduction in operator costs (operations)",
	'b3': "Reduction in passenger waiting time",
	'b4': "Reduction in passenger riding time",
	'b5': "Increase in driver breaks",
	'b6': "Improvement in regularity of driver breaks",
	'b7': "Reduction in external costs to society",
	'op_roi': "Annualized Operator ROI (%)",
	'ovr_roi': "Annualized Overall ROI (%)"
};

// Analytic Formulas //

function red_bus_op() { // Xb
	return 365.0 * (d['T'] - d['T*']) * d['L'] / d['v']; // (bus-hrs/yr)
}

function red_bus_op_year() { // Xby
	return (d['T'] - d['T*']) * d['L'] / d['v'] / d['H']; // (bus-hrs/yr)
}

function inc_drv_break_hours() { // Xd
	return (d['B*'] - d['B']) * d['T'] * 365; // (driver-hrs/yr)
}

function red_pass_hours_waited() { // Xw
	return d['D'] * (Math.min(2 * d['s'], 0.5 * (d['H'] * 1.0 / d['T'] + d['T'] * Math.pow(d['S'], 2) * 1.0 / d['H'])) - Math.min(2 * d['s*'], 0.5 * (d['H'] * 1.0 / d['T*'] + d['T*'] * Math.pow(d['S*'], 2) * 1.0 / d['H']))); // (pax-hrs/yr)
}

function red_pass_hours_riding_time() { // Xp
	return d['D'] * (d['l'] * 1.0 / d['v'] - d['l'] * 1.0 / d['v*']); // (pax-hrs/yr)
}

function red_num_drv_hours_wasted_relieving_drivers() { // Xc
	return 4 * (d['M'] * d['s'] - d['M*'] * d['s*']) * Math.floor(d['H'] * 1.0 / d['C']) * 365; // (driver-hrs/yr)
}

function red_hours_uncertain_break_times() { // Xr
	return (d['s'] * d['T'] - d['s*'] * d['T*']) * 365 * d['n']; // (driver-hrs/yr)
}

function red_num_buses_sim_op() { // Xm
	return d['M'] - d['M*'];
}

// Benefits //

function b1() {
	return d['a_o'];
}

function b2() {
	return d['a_b'] * d['X_by']() + d['X_m']() * (d['a_m'] + Math.floor(d['H'] * 1.0 / d['C']) * d['a_l']) + d['a_l'] * d['X_c']() / 2000.0;
}

function b3() {
	return d['a_w'] * d['X_w']();
}

function b4() {
	return d['a_p'] * d['X_p']();
}

function b5() {
	return d['a_d'] * d['X_d']();
}

function b6() {
	return d['a_r'] * d['X_r']();
}

function b7() {
	return d['a_e'] * d['X_b']();
}

// Results //

function an_op_roi() {
	return 100.0 * (d['b1']() + d['b2']() - d['a']) / d['a'];
}

function an_ovr_roi() {
	return 100.0 * (d['b1']() + d['b2']() + d['b3']() + d['b4']() + d['b5']() + d['b6']() + d['b7']() - d['a']) / d['a'];
}

// Special Operator Decisions Calculations
function calculateM() {
    return d['T'] * (d['L'] / d['v'] + d['B']) / d['H']
}

function calculateT() {
    return d['M'] * d['H'] / (d['L'] / d['v'] + d['B'])
}

function calculateB() {
    return d['M'] * d['H'] / d['T'] - d['L'] / d['v']
}

function calculateMs() {
    return d['T*'] * (d['L'] / d['v*'] + d['B*']) / d['H']
}

function calculateTs() {
    return d['M*'] * d['H'] / (d['L'] / d['v*'] + d['B*'])
}

function calculateBs() {
    return d['M*'] * d['H'] / d['T*'] - d['L'] / d['v*']
}


