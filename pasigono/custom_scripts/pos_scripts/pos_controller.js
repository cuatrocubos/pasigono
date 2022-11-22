var writtenNumber = require('written-number');
erpnext.PointOfSale.Controller = class extends erpnext.PointOfSale.Controller {
  make_app() {
    this.prepare_dom();
    this.prepare_components();
    this.prepare_menu();
    this.make_new_invoice();
    this.init_stripe_terminal();
  }

  init_stripe_terminal() {
    if (window.enable_stripe_terminal == 1) {
      this.stripe = new erpnext.PointOfSale.StripeTerminal();
      frappe.dom.freeze();
      //this.stripe.connect_to_stripe_terminal(this, true);
      this.stripe.assign_stripe_connection_token(this, true);
      frappe.dom.unfreeze();
    }
  }

  init_order_summary() {
    this.order_summary = new erpnext.PointOfSale.PastOrderSummary({
      wrapper: this.$components_wrapper,
      events: {
        get_frm: () => this.frm,

        process_return: (name) => {
          this.recent_order_list.toggle_component(false);
          frappe.db.get_doc('POS Invoice', name).then((doc) => {
            frappe.run_serially([
              () => this.make_return_invoice(doc),
              () => this.cart.load_invoice(),
              () => this.item_selector.toggle_component(true),
            ]);
          });
        },
        edit_order: (name) => {
          this.recent_order_list.toggle_component(false);
          frappe.run_serially([
            () => this.frm.refresh(name),
            () => this.frm.call('reset_mode_of_payments'),
            () => this.cart.load_invoice(),
            () => this.item_selector.toggle_component(true),
          ]);
        },
        delete_order: (name) => {
          frappe.model.delete_doc(this.frm.doc.doctype, name, () => {
            this.recent_order_list.refresh_list();
          });
        },
        new_order: () => {
          frappe.run_serially([
            () => frappe.dom.freeze(),
            () => this.make_new_invoice(),
            () => this.item_selector.toggle_component(true),
            () => frappe.dom.unfreeze(),
          ]);
        },
        raw_print: () => {
          this.raw_print(this.frm);
        },
        open_cash_drawer: () => {
          this.open_cash_drawer();
        },
      },
    });
  }

  async prepare_app_defaults(data) {
    this.pos_opening = data.name;
    this.company = data.company;
    this.pos_profile = data.pos_profile;
    this.pos_opening_time = data.period_start_date;
    this.item_stock_map = {};
    this.settings = {};
    window.tax_templates = [];
    window.company = {};

    frappe.db
      .get_value('Stock Settings', undefined, 'allow_negative_stock')
      .then(({ message }) => {
        this.allow_negative_stock = flt(message.allow_negative_stock) || false;
      });

    frappe.db
      .get_list('Item Tax Template', {
        filters: { company: this.company },
        fields: ['name', 'title'],
      })
      .then((res) => {
        window.tax_templates = res;
      });

    frappe.db.get_doc('Company', this.company).then((res) => {
      window.company = res;
    });

    frappe.call({
      method:
        'erpnext.selling.page.point_of_sale.point_of_sale.get_pos_profile_data',
      args: { pos_profile: this.pos_profile },
      callback: (res) => {
        const profile = res.message;
        window.enable_raw_print = profile.enable_raw_printing;
        window.enable_stripe_terminal = profile.enable_stripe_terminal;
        window.stripe_mode_of_payment = profile.stripe_mode_of_payment;
        //Select raw printer
        if (window.enable_raw_print == 1) {
          frappe.db.get_doc('QZ Tray Settings', undefined).then((qz_doc) => {
            if (
              qz_doc.trusted_certificate != null &&
              qz_doc.trusted_certificate != '' &&
              qz_doc.private_certificate != '' &&
              qz_doc.private_certificate != null
            ) {
              frappe.ui.form.qz_init().then(function () {
                ///// QZ Certificate ///
                qz.security.setCertificatePromise(function (resolve, reject) {
                  resolve(qz_doc.trusted_certificate);
                });
                qz.security.setSignaturePromise(function (toSign) {
                  return function (resolve, reject) {
                    try {
                      var pk = KEYUTIL.getKey(qz_doc.private_certificate);
                      //var sig = new KJUR.crypto.Signature({"alg": "SHA512withRSA"});  // Use "SHA1withRSA" for QZ Tray 2.0 and older
                      var sig = new KJUR.crypto.Signature({
                        alg: 'SHA1withRSA',
                      }); // Use "SHA1withRSA" for QZ Tray 2.0 and older
                      sig.init(pk);
                      sig.updateString(toSign);
                      var hex = sig.sign();
                      resolve(stob64(hextorstr(hex)));
                    } catch (err) {
                      console.error(err);
                      reject(err);
                    }
                  };
                });
              });
            }
            var d = new frappe.ui.Dialog({
              fields: [
                {
                  fieldname: 'printer',
                  fieldtype: 'Select',
                  reqd: 1,
                  label: 'Printer',
                },
              ],
              primary_action: function () {
                window.raw_printer = d.get_values().printer;
                d.hide();
              },
              secondary_action: function () {
                d.hide();
              },
              secondary_action_label: 'Cancel',
              title: 'Select printer for Raw Printing',
            });
            frappe.ui.form.qz_get_printer_list().then((data) => {
              d.set_df_property('printer', 'options', data);
              d.show();
            });
          });
        }
        window.automatically_print = profile.automatically_print;
        window.open_cash_drawer_automatically =
          profile.open_cash_drawer_automatically;
        //For weigh scale
        window.enable_weigh_scale = profile.enable_weigh_scale;
        Object.assign(this.settings, profile);
        this.settings.customer_groups = profile.customer_groups.map(
          (group) => group.name
        );
        this.make_app();
      },
    });

    /*frappe.db.get_doc("POS Profile", this.pos_profile).then((profile) => {
			window.enable_raw_print = profile.enable_raw_printing;
			window.enable_stripe_terminal = profile.enable_stripe_terminal;
			window.stripe_mode_of_payment = profile.stripe_mode_of_payment;
			//Select raw printer
			if(window.enable_raw_print == 1){
				frappe.db.get_doc('QZ Tray Settings', undefined).then((qz_doc) => {
					if(qz_doc.trusted_certificate != null && qz_doc.trusted_certificate != "" && qz_doc.private_certificate != "" && qz_doc.private_certificate != null){
						frappe.ui.form.qz_init().then(function(){
							///// QZ Certificate ///
							qz.security.setCertificatePromise(function(resolve, reject) {
								resolve(qz_doc.trusted_certificate);
							});
							qz.security.setSignaturePromise(function(toSign) {
								return function(resolve, reject) {
									try {
										var pk = KEYUTIL.getKey(qz_doc.private_certificate);
										//var sig = new KJUR.crypto.Signature({"alg": "SHA512withRSA"});  // Use "SHA1withRSA" for QZ Tray 2.0 and older
										var sig = new KJUR.crypto.Signature({"alg": "SHA1withRSA"});  // Use "SHA1withRSA" for QZ Tray 2.0 and older
										sig.init(pk); 
										sig.updateString(toSign);
										var hex = sig.sign();
										resolve(stob64(hextorstr(hex)));
									} catch (err) {
										console.error(err);
										reject(err);
									}
								};
							});	
						});
					}
					var d = new frappe.ui.Dialog({
						'fields': [
							{'fieldname': 'printer', 'fieldtype': 'Select', 'reqd': 1, 'label': "Printer"}
						],
						primary_action: function(){
							window.raw_printer = d.get_values().printer;
							d.hide();
						},
						secondary_action: function(){
							d.hide();
						},
						secondary_action_label: "Cancel",
						'title': 'Select printer for Raw Printing'
					});
					frappe.ui.form.qz_get_printer_list().then((data) => {
						d.set_df_property('printer', 'options', data);
						d.show();
					});	
				});
			}
			window.automatically_print = profile.automatically_print;
			window.open_cash_drawer_automatically = profile.open_cash_drawer_automatically;
			//For weigh scale
			window.enable_weigh_scale = profile.enable_weigh_scale;
			Object.assign(this.settings, profile);
			this.settings.customer_groups = profile.customer_groups.map(group => group.customer_group);
			this.make_app();
		});*/
  }

  init_item_details() {
    this.item_details = new erpnext.PointOfSale.ItemDetails({
      wrapper: this.$components_wrapper,
      settings: this.settings,
      events: {
        get_frm: () => this.frm,

        toggle_item_selector: (minimize) => {
          this.item_selector.resize_selector(minimize);
          this.cart.toggle_numpad(minimize);
        },

        form_updated: (item, field, value) => {
          const item_row = frappe.model.get_doc(item.doctype, item.name);
          if (item_row && item_row[field] != value) {
            const args = {
              field,
              value,
              item: this.item_details.current_item,
            };
            return this.on_cart_update(args);
          }

          return Promise.resolve();
        },

        highlight_cart_item: (item) => {
          const cart_item = this.cart.get_cart_item(item);
          this.cart.toggle_item_highlight(cart_item);
        },

        item_field_focused: (fieldname) => {
          this.cart.toggle_numpad_field_edit(fieldname);
        },
        set_value_in_current_cart_item: (selector, value) => {
          this.cart.update_selector_value_in_cart_item(
            selector,
            value,
            this.item_details.current_item
          );
        },
        clone_new_batch_item_in_frm: (batch_serial_map, item) => {
          // called if serial nos are 'auto_selected' and if those serial nos belongs to multiple batches
          // for each unique batch new item row is added in the form & cart
          Object.keys(batch_serial_map).forEach((batch) => {
            const item_to_clone = this.frm.doc.items.find(
              (i) => i.name == item.name
            );
            const new_row = this.frm.add_child('items', { ...item_to_clone });
            // update new serialno and batch
            new_row.batch_no = batch;
            new_row.serial_no = batch_serial_map[batch].join(`\n`);
            new_row.qty = batch_serial_map[batch].length;
            this.frm.doc.items.forEach((row) => {
              if (item.item_code === row.item_code) {
                this.update_cart_html(row);
              }
            });
          });
        },
        remove_item_from_cart: () => this.remove_item_from_cart(),
        get_item_stock_map: () => this.item_stock_map,
        close_item_details: () => {
          this.item_details.toggle_item_details_section(null);
          this.cart.prev_action = null;
          this.cart.toggle_item_highlight();
          //For weigh scale
          if (window.enable_weigh_scale == 1) {
            window.is_item_details_open = false;
            window.mettlerWorker.postMessage({ command: 'stop' });
          }
        },
        get_available_stock: (item_code, warehouse) =>
          this.get_available_stock(item_code, warehouse),
      },
    });
  }

  remove_item_from_cart() {
    frappe.dom.freeze();
    const { doctype, name, current_item } = this.item_details;

    return frappe.model
      .set_value(doctype, name, 'qty', 0)
      .then(() => {
        frappe.model.clear_doc(doctype, name);
        this.update_cart_html(current_item, true);
        this.item_details.toggle_item_details_section(null);
        frappe.dom.unfreeze();
      })
      .catch((e) => console.log(e));

    //For weigh scale
    if (window.enable_weigh_scale == 1) {
      window.is_item_details_open = false;
    }
  }

  init_payments() {
    this.payment = new erpnext.PointOfSale.Payment({
      wrapper: this.$components_wrapper,
      events: {
        get_frm: () => this.frm || {},

        get_customer_details: () => this.customer_details || {},

        toggle_other_sections: (show) => {
          if (show) {
            this.item_details.$component.is(':visible')
              ? this.item_details.$component.css('display', 'none')
              : '';
            this.item_selector.toggle_component(false);
          } else {
            this.item_selector.toggle_component(true);
          }
        },

        submit_invoice: () => {
          //Support for stripe payments
          var allowSubmit = 1;
          if (window.enable_stripe_terminal == 1) {
            if (this.frm.doc.payments.length > 0) {
              for (var i = 0; i <= this.frm.doc.payments.length; i++) {
                if (this.frm.doc.payments[i] != undefined) {
                  if (
                    this.frm.doc.payments[i].mode_of_payment ==
                      window.stripe_mode_of_payment &&
                    this.frm.doc.payments[i].base_amount != 0
                  ) {
                    if (this.frm.doc.payments[i].amount > 0) {
                      allowSubmit = 0;
                    } else if (
                      this.frm.doc.is_return == 1 &&
                      this.frm.doc.payments[i].card_payment_intent
                    ) {
                      allowSubmit = 0;
                    } else if (
                      this.frm.doc.is_return == 1 &&
                      !this.frm.doc.payments[i].card_payment_intent
                    ) {
                      frappe.throw(
                        'This transaction was not paid using a Stripe Payment. Please change the return payment method.'
                      );
                    }
                  }
                }
              }
            }
          }

          if (allowSubmit == 1) {
            this.frm.savesubmit().then((r) => {
              //For raw printing
              if (window.open_cash_drawer_automatically == 1) {
                this.open_cash_drawer();
              }

              if (window.automatically_print == 1) {
                this.raw_print(this.frm);
              }
              this.toggle_components(false);
              this.order_summary.toggle_component(true);
              this.order_summary.load_summary_of(this.frm.doc, true);
              frappe.show_alert({
                indicator: 'green',
                message: __('POS invoice {0} created succesfully', [
                  r.doc.name,
                ]),
              });
            });
          } else {
            //var stripe = new erpnext.PointOfSale.StripeTerminal();
            //this.stripe.assign_stripe_connection_token(this,true);
            this.stripe.collecting_payments(this, true);
          }
        },

        raw_print: () => {
          this.raw_print(this.frm);
        },

        open_cash_drawer: () => {
          this.open_cash_drawer();
        },
      },
    });
  }

  async on_cart_update(args) {
    frappe.dom.freeze();
    let item_row = undefined;
    try {
      let { field, value, item } = args;
      item_row = this.get_item_from_frm(item);
      const item_row_exists = !$.isEmptyObject(item_row);

      const from_selector = field === 'qty' && value === '+1';
      if (from_selector) value = flt(item_row.qty) + flt(value);

      if (item_row_exists) {
        if (field === 'qty') value = flt(value);

        if (
          ['qty', 'conversion_factor'].includes(field) &&
          value > 0 &&
          !this.allow_negative_stock
        ) {
          const qty_needed =
            field === 'qty'
              ? value * item_row.conversion_factor
              : item_row.qty * value;
          await this.check_stock_availability(
            item_row,
            qty_needed,
            this.frm.doc.set_warehouse
          );
        }

        if (this.is_current_item_being_edited(item_row) || from_selector) {
          await frappe.model.set_value(
            item_row.doctype,
            item_row.name,
            field,
            value
          );
          this.update_cart_html(item_row);
        }
      } else {
        if (!this.frm.doc.customer)
          return this.raise_customer_selection_alert();

        const { item_code, batch_no, serial_no, rate } = item;

        if (!item_code) return;

        const new_item = { item_code, batch_no, rate, [field]: value };

        if (serial_no) {
          await this.check_serial_no_availablilty(
            item_code,
            this.frm.doc.set_warehouse,
            serial_no
          );
          new_item['serial_no'] = serial_no;
        }

        if (field === 'serial_no')
          new_item['qty'] = value.split(`\n`).length || 0;

        item_row = this.frm.add_child('items', new_item);

        if (field === 'qty' && value !== 0 && !this.allow_negative_stock)
          await this.check_stock_availability(
            item_row,
            value,
            this.frm.doc.set_warehouse
          );

        await this.trigger_new_item_events(item_row);

        this.update_cart_html(item_row);

        if (this.item_details.$component.is(':visible'))
          this.edit_item_details_of(item_row);

        if (
          this.check_serial_batch_selection_needed(item_row) &&
          !this.item_details.$component.is(':visible')
        )
          this.edit_item_details_of(item_row);
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (window.enable_stripe_terminal == 1) {
        this.stripe.display_details(this);
      }
      frappe.dom.unfreeze();
      return item_row;
    }
  }

  open_cash_drawer() {
    if (window.enable_raw_print == 1 && window.raw_printer) {
      var me = this;
      frappe.ui.form.qz_get_printer_list().then(function (printers) {
        var config;
        printers.forEach(function (printer) {
          if (printer == window.raw_printer) {
            config = qz.configs.create(printer);
          }
        });
        var data = [
          '\x10' + '\x14' + '\x01' + '\x00' + '\x05', //Generate Pulse to kick-out cash drawer
        ];
        qz.print(config, data);
      });
    }
  }

  raw_print(frm) {
    if (window.enable_raw_print == 1 && window.raw_printer) {
      var me = this;

      frappe.ui.form.qz_get_printer_list().then(function (printers) {
        var config;
        printers.forEach(function (printer) {
          if (printer == window.raw_printer) {
            config = qz.configs.create(printer);
          }
        });

        var data = [
          '\x1B' + '\x40', //init
          '\x1B' + '\x61' + '\x31', //center align
          frm.doc.company + '\x0A',
          company.tax_id + '\x0A',
          frm.doc.company_address_display
            .replace(/\n/g, '')
            .replace(/(<([^>]+)>)/gi, '\x0A') + '\x0A',
          '\x1B' + '\x45' + '\x0A', //bold on
          'FACTURA' + '\x0A',
          '\x1B' + '\x45' + '\x0A' + '\x0A', //bold off
          'Factura No.' + '\x0A',
          frm.doc.invoice_number + '\x0A',
          'CAI' + '\x0A',
          frm.doc.cai + '\x0A' + '\x0A',
          'Fecha Limite Emision ' +
            moment(frm.doc.fecha_limite_emision).format('DD-MM-YYYY') +
            '\x0A',
          'Rango Autorizado' +
            '\x0A' +
            frm.doc.rango_autorizado.replace(' al ', '\x0A') +
            '\x0A',
          '\x1B' + '\x61' + '\x30' + '\x0A' + '\x0A', // left align
          'Cliente : ' + frm.doc.customer_name + '\x0A',
          'RTN     : ' +
            (frm.doc.customer_tax_id ? frm.doc.customer_tax_id : '') +
            '\x0A',
          'Fecha   : ' +
            moment(frm.doc.posting_date).format('DD-MM-YYYY') +
            '\x0A',
          '\x1B' + '\x45' + '\x0D' + '\x0A', //bold on
          'Descripcion                        Monto' + '\x0A',
          '----------------------------------------' + '\x0A',
          '\x1B' + '\x45' + '\x0A', //bold off
        ];
        frm.doc.items.forEach(function (row) {
          var rdata = me.get_item_print(
            row.item_code,
            row.qty,
            row.rate,
            row.amount,
            frm.doc.currency
          );
          data.push.apply(data, rdata);
        });
        //data.push(
        //	'\x1B' + '\x61' + '\x32' // right align
        //);
        data.push.apply(data, [
          '----------------------------------------' + '\x0A',
        ]);
        var tprint = me.get_total_print(frm.doc);
        data.push.apply(data, tprint);
        var extraprint = me.get_extra_print(frm.doc);
        data.push.apply(data, extraprint);
        var cut = [
          '\x0A' +
            '\x0A' +
            '\x0A' +
            '\x0A' +
            '\x0A' +
            '\x0A' +
            '\x0A' +
            '\x0A' +
            '\x0A' +
            '\x0A',
          '\x1B' + '\x69',
        ];
        data.push.apply(data, cut); // cut paper (old syntax)
        qz.print(config, data);
      });
    }
  }

  get_total_print(doc) {
    var ret = [];
    // Subtotal
    var length = doc.net_total.toString().length;
    var subtotal = 'Subtotal';
    for (var i = length; i <= 11; i++) {
      subtotal = subtotal + ' ';
    }
    subtotal = subtotal + format_currency(doc.net_total);
    var tlength = subtotal.length;
    //Add extra spaces to align everything to the right
    for (var i = 0; i < 40 - tlength; i++) {
      subtotal = ' ' + subtotal;
    }
    ret.push(subtotal + '\x0A');

    // Descuentos
    var length = doc.discount_amount.toString().length;
    var discounts = 'Descuentos y Rebajas';
    for (var i = length; i <= 11; i++) {
      discounts = discounts + ' ';
    }
    discounts = discounts + format_currency(doc.discount_amount);
    var tlength = discounts.length;
    //Add extra spaces to align everything to the right
    for (var i = 0; i < 40 - tlength; i++) {
      discounts = ' ' + discounts;
    }
    ret.push(discounts + '\x0A');

    //Taxes
    var tax_rates_per_item = Object.entries(
      JSON.parse(doc.taxes[0].item_wise_tax_detail)
    );
    var invoice_taxes = {
      exento_total: 0.0,
      exento_tax_total: 0.0,
      exonerado_total: 0.0,
      isv_15_total: 0.0,
      isv_18_total: 0.0,
      isv_15_tax_total: 0.0,
      isv_18_tax_total: 0.0,
    };

    window.tax_templates.map((tax_template) => {
      doc.items.forEach((item) => {
        if (item.item_tax_template == tax_template.name) {
          if (tax_template.title == 'ISV 15%') {
            invoice_taxes.isv_15_total += item.net_amount;
            tax_rates_per_item.map((tax_item) => {
              if (tax_item[0] === item.item_code) {
                invoice_taxes.isv_15_tax_total += tax_item[1][1];
              }
            });
          }
          if (tax_template.title == 'ISV 18%') {
            invoice_taxes.isv_18_total += item.net_amount;
            tax_rates_per_item.map((tax_item) => {
              if (tax_item[0] === item.item_code) {
                invoice_taxes.isv_18_tax_total += tax_item[1][1];
              }
            });
          }
          if (tax_template.title == 'Exento') {
            invoice_taxes.exento_total += item.net_amount;
            tax_rates_per_item.map((tax_item) => {
              if (tax_item[0] === item.item_code) {
                invoice_taxes.exento_tax_total += tax_item[1][1];
              }
            });
          }
        }
      });
    });

    // Exento
    var length = invoice_taxes.exento_total.toString().length;
    var exempt = 'Importe Exento';
    for (var i = length; i <= 11; i++) {
      exempt = exempt + ' ';
    }
    exempt = exempt + format_currency(invoice_taxes.exento_total);
    var tlength = exempt.length;
    //Add extra spaces to align everything to the right
    for (var i = 0; i < 40 - tlength; i++) {
      exempt = ' ' + exempt;
    }
    ret.push(exempt + '\x0A');

    // Exonerado
    var length = invoice_taxes.exonerado_total.toString().length;
    var exempt = 'Importe Exonerado';
    for (var i = length; i <= 11; i++) {
      exempt = exempt + ' ';
    }
    exempt = exempt + format_currency(invoice_taxes.exonerado_total);
    var tlength = exempt.length;
    //Add extra spaces to align everything to the right
    for (var i = 0; i < 40 - tlength; i++) {
      exempt = ' ' + exempt;
    }
    ret.push(exempt + '\x0A');

    // Gravado 15
    var length = invoice_taxes.isv_15_tax_total.toString().length;
    var exempt = 'Importe Gravado ISV 15%';
    for (var i = length; i <= 11; i++) {
      exempt = exempt + ' ';
    }
    exempt = exempt + format_currency(invoice_taxes.isv_15_tax_total);
    var tlength = exempt.length;
    //Add extra spaces to align everything to the right
    for (var i = 0; i < 40 - tlength; i++) {
      exempt = ' ' + exempt;
    }
    ret.push(exempt + '\x0A');

    // Gravado 18
    var length = invoice_taxes.isv_18_tax_total.toString().length;
    var exempt = 'Importe Gravado ISV 18%';
    for (var i = length; i <= 11; i++) {
      exempt = exempt + ' ';
    }
    exempt = exempt + format_currency(invoice_taxes.isv_18_tax_total);
    var tlength = exempt.length;
    //Add extra spaces to align everything to the right
    for (var i = 0; i < 40 - tlength; i++) {
      exempt = ' ' + exempt;
    }
    ret.push(exempt + '\x0A');

    // ISV 15
    var length = invoice_taxes.isv_15_total.toString().length;
    var exempt = 'ISV 15%';
    for (var i = length; i <= 11; i++) {
      exempt = exempt + ' ';
    }
    exempt = exempt + format_currency(invoice_taxes.isv_15_total);
    var tlength = exempt.length;
    //Add extra spaces to align everything to the right
    for (var i = 0; i < 40 - tlength; i++) {
      exempt = ' ' + exempt;
    }
    ret.push(exempt + '\x0A');

    // ISV 18
    var length = invoice_taxes.isv_18_total.toString().length;
    var exempt = 'ISV 15%';
    for (var i = length; i <= 11; i++) {
      exempt = exempt + ' ';
    }
    exempt = exempt + format_currency(invoice_taxes.isv_18_total);
    var tlength = exempt.length;
    //Add extra spaces to align everything to the right
    for (var i = 0; i < 40 - tlength; i++) {
      exempt = ' ' + exempt;
    }
    ret.push(exempt + '\x0A');

    // if (doc.taxes && doc.taxes.length > 0) {
    //   doc.taxes.forEach(function (row) {
    //     length = row.total.toString().length;
    //     total = row.description;
    //     for (var i = length; i <= 11; i++) {
    //       total = total + ' ';
    //     }
    //     total = total + doc.currency + doc.total.toString();
    //     var tlength = total.length;
    //     //Add extra spaces to align everything to the right
    //     for (var i = 0; i < 40 - tlength; i++) {
    //       total = ' ' + total;
    //     }
    //     ret.push(total + '\x0A');
    //   });
    // }

    //Grand Total
    ret.push('\x1B' + '\x45' + '\x0D'); //Bold on
    var total = 'Total';
    length = doc.grand_total.toString().length;
    for (var i = length; i <= 11; i++) {
      total = total + ' ';
    }
    total = total + format_currency(doc.grand_total);
    var tlength = total.length;
    //Add extra spaces to align everything to the right
    for (var i = 0; i < 40 - tlength; i++) {
      total = ' ' + total;
    }
    ret.push(total + '\x0A');
    ret.push('\x1B' + '\x45' + '\x0A' + '\x0A'); //Bold off

    //Payments
    var stripe_info = [];
    var cash_drawer = [];
    if (doc.payments && doc.payments.length > 0) {
      doc.payments.forEach(function (row) {
        if (row.base_amount > 0) {
          length = row.base_amount.toString().length;
          total = row.mode_of_payment + ' ';
          for (var i = length; i <= 11; i++) {
            total = total + ' ';
          }
          total = total + format_currency(row.base_amount);
          var tlength = total.length;
          //Add extra spaces to align everything to the right
          for (var i = 0; i < 40 - tlength; i++) {
            total = ' ' + total;
          }
          ret.push(total + '\x0A');

          //If it's a stripe payment, add mandatory information at end o receipt
          if (
            row.mode_of_payment == window.stripe_mode_of_payment &&
            row.base_amount > 0
          ) {
            stripe_info = [
              '\x1B' + '\x61' + '\x31', // center align,
              '\x0A',
              row.card_brand.toUpperCase() +
                ' XXXXXXXXXXXX' +
                row.card_last4 +
                '\x0A',
              'Auth CD: ' + row.card_authorization_code + '\x0A',
              'AID: ' + row.card_dedicated_file_name + '\x0A',
              row.card_application_preferred_name + '\x0A',
              'TVR: ' + row.card_terminal_verification_results + '\x0A',
              'TSI: ' + row.card_transaction_status_information + '\x0A',
              'IAD: ' + row.card_dedicated_file_name,
            ];
          }
        }
      });
    }

    //Total Payments
    ret.push('\x1B' + '\x45' + '\x0D'); //Bold on
    total = 'Recibido ';
    length = doc.grand_total.toString().length;
    for (var i = length; i <= 11; i++) {
      total = total + ' ';
    }
    total = total + format_currency(doc.paid_amount);
    var tlength = total.length;
    //Add extra spaces to align everything to the right
    for (var i = 0; i < 40 - tlength; i++) {
      total = ' ' + total;
    }
    ret.push(total + '\x0A');
    ret.push('\x1B' + '\x45' + '\x0A' + '\x0A'); //Bold off

    ret.push(writtenNumber(doc.grand_total, { lang: 'es' }) + '\x0A' + '\x0A');

    //Add the stripe data
    if (stripe_info.length > 0) {
      ret.push.apply(ret, stripe_info);
    }

    return ret;
  }

  get_extra_print(doc) {
    var ret = [
      'Registro SAG ' +
        (doc.identificativo_registro_sag
          ? doc.identificativo_registro_sag.toString()
          : '') +
        '\x0A',
      'Const. Regis. Exonerado # ' +
        (doc.correlativo_constancia_registro_exonerado
          ? doc.correlativo_constancia_registro_exonerado.toString()
          : '') +
        '\x0A',
      'OC Exenta ' +
        (doc.correlativo_orden_compra_exenta
          ? doc.correlativo_orden_compra_exenta.toString()
          : '') +
        '\x0A',
    ];

    return ret;
  }

  get_item_print(item, qty, rate, amount, currency) {
    var ilength = item.length;
    var ret = [];
    //Put in for loop in case item length > 30
    for (var i = 0; i < ilength; i = i + 29) {
      ret.push(item.substring(i, i + 29) + '\x0A');
    }

    //For quantity
    var qty_rate = qty.toString() + ' @ ' + format_currency(rate);
    var qlength = qty_rate.length;
    for (var i = 0; i < 29 - qlength; i++) {
      qty_rate = qty_rate + ' ';
    }

    //Add amount at end of qty-rate line
    var alength = format_currency(amount).length;
    for (var i = 0; i < 10 - alength; i++) {
      qty_rate = qty_rate + ' ';
    }
    qty_rate = qty_rate + format_currency(amount);
    ret.push(qty_rate + '\x0A');
    return ret;
  }
};
