/* ==========================================================================
   Gridora — form.js
   Enquiry form validation and submission states.

   The form is front-end only by default: nothing leaves the browser. Set
   GRIDORA.config.form.endpoint in js/config.js to a URL and the same payload
   is POSTed as JSON instead of being simulated.
   ========================================================================== */

window.GRIDORA = window.GRIDORA || {};

window.GRIDORA.initForm = function () {
  'use strict';

  var form = document.querySelector('[data-enquiry-form]');
  if (!form) return;

  var config = (window.GRIDORA.config && window.GRIDORA.config.form) || {};
  var submit = form.querySelector('[data-submit]');
  var status = document.querySelector('[data-form-status]');
  var summary = form.querySelector('[data-error-summary]');

  /* ---- Populate the selects from config ------------------------------- */
  function fill(name, values) {
    var select = form.querySelector('[name="' + name + '"]');
    if (!select || !values) return;
    values.forEach(function (value) {
      var option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }
  fill('projectType', config.projectTypes);
  fill('capacity', config.capacities);

  /* ---- Rules ----------------------------------------------------------
     Kept declarative so a new field is one entry, not a new branch.
     --------------------------------------------------------------------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  var PHONE = /^[+()\d][\d\s\-().]{6,19}$/;

  var rules = {
    name: function (value) {
      if (!value) return 'Please enter your name.';
      if (value.length < 2) return 'Please enter your full name.';
      return '';
    },
    email: function (value) {
      if (!value) return 'Please enter your work email address.';
      if (!EMAIL.test(value)) return 'Please enter a valid email address, for example name@company.com.';
      return '';
    },
    phone: function (value) {
      if (!value) return 'Please enter a contact number.';
      if (!PHONE.test(value)) return 'Please enter a valid phone number, digits only apart from + ( ) and -.';
      return '';
    },
    company: function (value) {
      if (!value) return 'Please enter your company or organisation.';
      return '';
    },
    projectType: function (value) {
      if (!value) return 'Please choose the type of project.';
      return '';
    },
    message: function (value) {
      if (!value) return 'Please tell us about your requirement.';
      if (value.length < 20) return 'A little more detail helps us route your enquiry — 20 characters or more.';
      return '';
    }
  };

  function fieldOf(input) { return input.closest('.field'); }

  function setError(input, message) {
    var field = fieldOf(input);
    if (!field) return;
    var slot = field.querySelector('[data-error]');

    if (message) {
      field.classList.add('is-invalid');
      input.setAttribute('aria-invalid', 'true');
      if (slot) slot.querySelector('span').textContent = message;
    } else {
      field.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
    }
  }

  function validate(input) {
    var rule = rules[input.name];
    if (!rule) return true;
    var message = rule(input.value.trim());
    setError(input, message);
    return !message;
  }

  /* Validate on blur; once a field is marked invalid, re-check as it is
     corrected so the error clears the moment it is fixed. */
  Object.keys(rules).forEach(function (name) {
    var input = form.querySelector('[name="' + name + '"]');
    if (!input) return;

    input.addEventListener('blur', function () { validate(input); });
    input.addEventListener('input', function () {
      if (fieldOf(input) && fieldOf(input).classList.contains('is-invalid')) validate(input);
    });
    input.addEventListener('change', function () {
      if (input.tagName === 'SELECT') validate(input);
    });
  });

  /* ---- Submit ---------------------------------------------------------- */
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var invalid = [];
    Object.keys(rules).forEach(function (name) {
      var input = form.querySelector('[name="' + name + '"]');
      if (input && !validate(input)) invalid.push(input);
    });

    if (invalid.length) {
      if (summary) {
        summary.textContent = invalid.length === 1
          ? 'One field needs attention before this can be sent.'
          : invalid.length + ' fields need attention before this can be sent.';
        summary.classList.add('is-visible');
      }
      invalid[0].focus();
      return;
    }

    if (summary) summary.classList.remove('is-visible');

    var payload = {};
    new FormData(form).forEach(function (value, key) { payload[key] = value; });

    submit.classList.add('is-loading');
    submit.disabled = true;

    var finish = function (ok) {
      submit.classList.remove('is-loading');
      submit.disabled = false;

      if (!ok) {
        if (summary) {
          summary.textContent = 'Something went wrong sending this enquiry. Please try again, or email us directly.';
          summary.classList.add('is-visible');
        }
        return;
      }

      form.hidden = true;
      if (status) {
        status.classList.add('is-visible');
        status.setAttribute('tabindex', '-1');
        status.focus();
      }
    };

    if (config.endpoint) {
      window.fetch(config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (response) { finish(response.ok); })
        .catch(function () { finish(false); });
    } else {
      // No endpoint configured: this build does not send anything anywhere.
      window.console.info('[Gridora] Enquiry captured locally (no endpoint configured):', payload);
      window.setTimeout(function () { finish(true); }, 850);
    }
  });
};
