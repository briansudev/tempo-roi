var data = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7'];
var b = new Bar("#chart", data, function(d) { return "$" + numeral(d).format("0a") + "/yr" }, function(d, self) { console.log(self); return "$" + d3.round(self.barValue(d), 2); });
var roiChart = new Bar("#roi-chart", ['op_roi', 'ovr_roi'], function(d) { return d + "%"; }, function(d, self) { console.log(self); return d3.round(self.barValue(d), 2) + "%"; });

function updateInputs() {
	num_routes = parseInt($('#num_routes').val()); // R
	route_length = parseInt($('#route_length').val()); // L km
	num_termini = parseInt($('#num_termini').val()); // n
	avg_pass_dist = parseInt($('#avg_pass_dist').val()); // l; km
	pass_ridership = parseInt($('#pass_ridership').val()); // D
	op_hours = parseInt($('#op_hours').val()); // H
	shift_dur = parseInt($('#shift_dur').val()); // C

	// System operation //

	// Operator Decisions
	num_buses = parseInt($('#num_buses').val()); // M
	num_buses_ = parseInt($('#num_buses_').val()); // M*
	num_bus_deps = parseInt($('#num_bus_deps').val()); // T
	num_bus_deps_ = parseInt($('#num_bus_deps_').val()); // T*
	driver_break_time = parseFloat($('#driver_break_time').val()); // B
	driver_break_time_ = parseFloat($('#driver_break_time_').val()); //B*

	// Performance Inputs
	speed = parseFloat($('#speed').val()); // v
	speed_ = parseFloat($('#speed_').val()); // v*
	punc_dev = parseFloat($('#punc_dev').val()); // s
	punc_dev_ = parseFloat($('#punc_dev_').val()); // s*
	serv_int_dev = parseFloat($('#serv_int_dev').val()); // S
	serv_int_dev_ = parseFloat($('#serv_int_dev_').val()); // S*

	// Valuation Inputs //ƒ

	pass_time_sav = parseFloat($('#pass_time_sav').val()); // a_p; Default $10/pax-hr
	pass_wait_time_sav = parseFloat($('#pass_wait_time_sav').val()); // a_w; Default $20/pax-hr
	bus_capt_cost = parseFloat($('#bus_capt_cost').val()); // a_m; Default $5000/bus-yr
	bus_opt_cost = parseFloat($('#bus_opt_cost').val()); // a_b; Default $20000/bus-yr
	drv_shift_cost = parseFloat($('#drv_shift_cost').val()); // a_l; Default = $60000/shift-yr
	drv_inc_break = parseFloat($('#drv_inc_break').val()); // a_d; Default $10/hr
	rm_uncert_drv_rest = parseFloat($('#rm_uncert_drv_rest').val()); // a_r; Default $5/hr
	elm_hour_bus_runtime = parseFloat($('#elm_hour_bus_runtime').val()); // a_e; Default $5/hr

	// Costs //

	tempo_cost = parseFloat($('#tempo_cost').val()); // a
	tempo_repl_act_cost = parseFloat($('#tempo_repl_act_cost').val()); // a_o;; Default $0/yr
	return 'success';
};

function updateResults() {
	$('#b1').text(d['b1']().toFixed(2));
	$('#b2').text(d['b2']().toFixed(2));
	$('#b3').text(d['b3']().toFixed(2));
	$('#b4').text(d['b4']().toFixed(2));
	$('#b5').text(d['b5']().toFixed(2));
	$('#b6').text(d['b6']().toFixed(2));
	$('#b7').text(d['b7']().toFixed(2));
	$('#op_roi').text(d['op_roi']().toFixed(2));
	$('#ovr_roi').text(d['ovr_roi']().toFixed(2));
}

$('input').change(function() {
	updateInputs();
	updateD();
	updateResults();
	b.update();
    roiChart.update();
});

$(function() {
	updateResults();
	b.initialize();
    roiChart.initialize();
});

