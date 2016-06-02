import Ember from "ember";

class AppendVMDebugger {
  constructor() {
    this.logs = [];
  }

  didPushFrame() {
    this.logs.pushObject("<ul>");
  }

  didPopFrame() {
    this.logs.pushObject("</ul>");
  }

  didExecute(opcode) {
    this.logs.pushObject(`<li>${opcode.type}</li>`);
  }
}

class Inspector {
  constructor(agent) {
    this.agent = agent;
    this.debugger = new AppendVMDebugger();
  }
}

export default Ember.Component.extend({
  isLoading: true,
  inspector: null,

  formattedLogs: Ember.computed('inspector.debugger.logs', function() {
    let logs = this.get('inspector.debugger.logs');
    return logs && logs.join('\n');
  }),

  willInsertElement() {
    window.Inspector = {
      connect: agent => {
        let inspector = new Inspector(agent);

        this.setProperties({ isLoading: false, inspector });

        return inspector;
      }
    };
  }
});
