/**
 * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {VisibilityModel} from '../visibility-model';

const NO_SPEC = {};
const NO_CALC = () => 0;


describes.sandboxed('VisibilityModel', {}, () => {
  let startTime;
  let clock;

  beforeEach(() => {
    clock = sandbox.useFakeTimers();
    startTime = 10000;
    clock.tick(startTime + 1);
  });


  describe('config', () => {

    function config(spec) {
      return new VisibilityModel(spec, NO_CALC).spec_;
    }

    it('should parse visiblePercentageMin', () => {
      expect(config({}).visiblePercentageMin).to.equal(0);
      expect(config({visiblePercentageMin: ''}).visiblePercentageMin)
          .to.equal(0);
      expect(config({visiblePercentageMin: 0}).visiblePercentageMin)
          .to.equal(0);
      expect(config({visiblePercentageMin: '0'}).visiblePercentageMin)
          .to.equal(0);
      expect(config({visiblePercentageMin: 50}).visiblePercentageMin)
          .to.equal(0.5);
      expect(config({visiblePercentageMin: '50'}).visiblePercentageMin)
          .to.equal(0.5);
      expect(config({visiblePercentageMin: 100}).visiblePercentageMin)
          .to.equal(1);
      expect(config({visiblePercentageMin: '100'}).visiblePercentageMin)
          .to.equal(1);
    });

    it('should parse visiblePercentageMax', () => {
      expect(config({}).visiblePercentageMax).to.equal(1);
      expect(config({visiblePercentageMax: ''}).visiblePercentageMax)
          .to.equal(1);
      expect(config({visiblePercentageMax: 0}).visiblePercentageMax)
          .to.equal(1);
      expect(config({visiblePercentageMax: '0'}).visiblePercentageMax)
          .to.equal(1);
      expect(config({visiblePercentageMax: 50}).visiblePercentageMax)
          .to.equal(0.5);
      expect(config({visiblePercentageMax: '50'}).visiblePercentageMax)
          .to.equal(0.5);
      expect(config({visiblePercentageMax: 100}).visiblePercentageMax)
          .to.equal(1);
      expect(config({visiblePercentageMax: '100'}).visiblePercentageMax)
          .to.equal(1);
    });

    it('should parse totalTimeMin', () => {
      expect(config({}).totalTimeMin).to.equal(0);
      expect(config({totalTimeMin: ''}).totalTimeMin)
          .to.equal(0);
      expect(config({totalTimeMin: 0}).totalTimeMin)
          .to.equal(0);
      expect(config({totalTimeMin: '0'}).totalTimeMin)
          .to.equal(0);
      expect(config({totalTimeMin: 50}).totalTimeMin)
          .to.equal(50);
      expect(config({totalTimeMin: '50'}).totalTimeMin)
          .to.equal(50);
      expect(config({totalTimeMin: 100}).totalTimeMin)
          .to.equal(100);
      expect(config({totalTimeMin: '100'}).totalTimeMin)
          .to.equal(100);
    });

    it('should parse totalTimeMax', () => {
      expect(config({}).totalTimeMax).to.equal(Infinity);
      expect(config({totalTimeMax: ''}).totalTimeMax)
          .to.equal(Infinity);
      expect(config({totalTimeMax: 0}).totalTimeMax)
          .to.equal(Infinity);
      expect(config({totalTimeMax: '0'}).totalTimeMax)
          .to.equal(Infinity);
      expect(config({totalTimeMax: 50}).totalTimeMax)
          .to.equal(50);
      expect(config({totalTimeMax: '50'}).totalTimeMax)
          .to.equal(50);
      expect(config({totalTimeMax: 100}).totalTimeMax)
          .to.equal(100);
      expect(config({totalTimeMax: '100'}).totalTimeMax)
          .to.equal(100);
    });

    it('should parse continuousTimeMin', () => {
      expect(config({}).continuousTimeMin).to.equal(0);
      expect(config({continuousTimeMin: ''}).continuousTimeMin)
          .to.equal(0);
      expect(config({continuousTimeMin: 0}).continuousTimeMin)
          .to.equal(0);
      expect(config({continuousTimeMin: '0'}).continuousTimeMin)
          .to.equal(0);
      expect(config({continuousTimeMin: 50}).continuousTimeMin)
          .to.equal(50);
      expect(config({continuousTimeMin: '50'}).continuousTimeMin)
          .to.equal(50);
      expect(config({continuousTimeMin: 100}).continuousTimeMin)
          .to.equal(100);
      expect(config({continuousTimeMin: '100'}).continuousTimeMin)
          .to.equal(100);
    });

    it('should parse continuousTimeMax', () => {
      expect(config({}).continuousTimeMax).to.equal(Infinity);
      expect(config({continuousTimeMax: ''}).continuousTimeMax)
          .to.equal(Infinity);
      expect(config({continuousTimeMax: 0}).continuousTimeMax)
          .to.equal(Infinity);
      expect(config({continuousTimeMax: '0'}).continuousTimeMax)
          .to.equal(Infinity);
      expect(config({continuousTimeMax: 50}).continuousTimeMax)
          .to.equal(50);
      expect(config({continuousTimeMax: '50'}).continuousTimeMax)
          .to.equal(50);
      expect(config({continuousTimeMax: 100}).continuousTimeMax)
          .to.equal(100);
      expect(config({continuousTimeMax: '100'}).continuousTimeMax)
          .to.equal(100);
    });
  });


  describe('structure', () => {
    let visibility;
    let calcVisibility;

    beforeEach(() => {
      visibility = 0;
      calcVisibility = () => visibility;
    });

    it('should dispose fully', () => {
      const vh = new VisibilityModel(NO_SPEC, calcVisibility);
      vh.scheduledRunId_ = 1;
      const unsubscribeSpy = sandbox.spy();
      vh.unsubscribe(unsubscribeSpy);

      vh.dispose();
      expect(vh.scheduledRunId_).to.be.null;
      expect(unsubscribeSpy).to.be.calledOnce;
      expect(vh.unsubscribe_).to.be.empty;
      expect(vh.eventResolver_).to.be.null;
    });

    it('should update on any visibility event', () => {
      const updateStub = sandbox.stub(VisibilityModel.prototype, 'update');
      const vh = new VisibilityModel(NO_SPEC, calcVisibility);
      vh.setReady(true);
      vh.setReady(false);
      expect(updateStub.callCount).to.equal(2);
    });

    it('should NOT update when started visible', () => {
      const updateStub = sandbox.stub(VisibilityModel.prototype, 'update_');
      visibility = 1;
      const vh = new VisibilityModel(NO_SPEC, calcVisibility);
      expect(updateStub).to.not.be.called;

      vh.update();
      expect(updateStub).to.be.calledOnce;
      expect(updateStub).to.be.calledWith(1);
    });

    it('should NOT update when started invisible', () => {
      const updateStub = sandbox.stub(VisibilityModel.prototype, 'update_');
      visibility = 0;
      const vh = new VisibilityModel(NO_SPEC, calcVisibility);
      expect(updateStub).to.not.be.called;

      vh.update();
      expect(updateStub).to.be.calledOnce;
      expect(updateStub).to.be.calledWith(0);
    });

    it('should update visibility and ready', () => {
      const updateStub = sandbox.stub(VisibilityModel.prototype, 'update_');
      visibility = 0;
      const vh = new VisibilityModel(NO_SPEC, calcVisibility);

      visibility = 0.5;
      vh.update();
      expect(updateStub.args[0][0]).to.equal(0.5);

      vh.setReady(false);
      expect(updateStub.args[1][0]).to.equal(0);

      vh.setReady(true);
      expect(updateStub.args[2][0]).to.equal(0.5);
    });

    it('should default export var state', () => {
      const vh = new VisibilityModel(NO_SPEC, calcVisibility);
      expect(vh.getState(0)).to.contains({
        firstSeenTime: 0,
        lastSeenTime: 0,
        lastVisibleTime: 0,
        fistVisibleTime: 0,
        maxContinuousVisibleTime: 0,
        totalVisibleTime: 0,
        loadTimeVisibility: 0,
        minVisiblePercentage: 0,
        maxVisiblePercentage: 0,
      });
    });

    it('should export full state', () => {
      const vh = new VisibilityModel(NO_SPEC, calcVisibility);
      vh.firstSeenTime_ = 2;
      vh.lastSeenTime_ = 3;
      vh.lastVisibleTime_ = 4;
      vh.fistVisibleTime_ = 5;
      vh.maxContinuousVisibleTime_ = 10;
      vh.totalVisibleTime_ = 11;
      vh.loadTimeVisibility_ = 0.1;
      vh.minVisiblePercentage_ = 0.2;
      vh.maxVisiblePercentage_ = 0.3;
      expect(vh.getState(1)).to.deep.equal({
        // Base times:
        firstSeenTime: 1,
        lastSeenTime: 2,
        lastVisibleTime: 3,
        fistVisibleTime: 4,
        // Durations:
        maxContinuousVisibleTime: 10,
        totalVisibleTime: 11,
        // Percent:
        loadTimeVisibility: 10,
        minVisiblePercentage: 20,
        maxVisiblePercentage: 30,
      });
    });
  });


  describe('update monitor', () => {
    let vh;
    let updateStub;
    let eventSpy;

    beforeEach(() => {
      vh = new VisibilityModel({
        minVisiblePercentage: 25,
        totalTimeMin: 10,
        continuousTimeMin: 10,
      }, NO_CALC);
      updateStub = sandbox.stub(vh, 'update');
      eventSpy = vh.eventResolver_ = sandbox.spy();
    });

    it('conditions not met', () => {
      vh.update_(0.1);
      expect(vh.scheduledRunId_).to.be.ok;
      expect(updateStub).to.not.be.called;

      // Check schedule for 10 seconds.
      clock.tick(9);
      expect(updateStub).to.not.be.called;
      clock.tick(1);
      expect(updateStub).to.be.calledOnce;
      expect(vh.scheduledRunId_).to.be.null;
    });

    it('conditions not met and cannot schedule', () => {
      vh.continuousTime_ = vh.totalVisibleTime_ = 10;
      vh.update_(0.1);
      expect(vh.scheduledRunId_).to.be.null;
    });

    it('conditions not met, schedule for total time', () => {
      vh.totalVisibleTime_ = 5;
      vh.update_(0.1);
      expect(vh.scheduledRunId_).to.be.ok;

      // Check schedule for 5 seconds.
      clock.tick(4);
      expect(updateStub).to.not.be.called;
      clock.tick(1);
      expect(updateStub).to.be.calledOnce;
      expect(vh.scheduledRunId_).to.be.null;
    });

    it('conditions not met, schedule for continuous time', () => {
      vh.continuousTime_ = 4;
      vh.update_(0.1);
      expect(vh.scheduledRunId_).to.be.ok;

      // Check schedule for 6 seconds.
      clock.tick(5);
      expect(updateStub).to.not.be.called;
      clock.tick(1);
      expect(updateStub).to.be.calledOnce;
      expect(vh.scheduledRunId_).to.be.null;
    });

    it('conditions not met, schedule w/o total time', () => {
      vh.totalVisibleTime_ = 10;
      vh.continuousTime_ = 4;
      vh.update_(0.1);
      expect(vh.scheduledRunId_).to.be.ok;

      // Check schedule for 6 seconds.
      clock.tick(5);
      expect(updateStub).to.not.be.called;
      clock.tick(1);
      expect(updateStub).to.be.calledOnce;
      expect(vh.scheduledRunId_).to.be.null;
    });

    it('conditions not met, schedule w/o continuous time', () => {
      vh.totalVisibleTime_ = 5;
      vh.continuousTime_ = 10;
      vh.update_(0.1);
      expect(vh.scheduledRunId_).to.be.ok;

      // Check schedule for 5 seconds.
      clock.tick(4);
      expect(updateStub).to.not.be.called;
      clock.tick(1);
      expect(updateStub).to.be.calledOnce;
      expect(vh.scheduledRunId_).to.be.null;
    });

    it('conditions not met -> invisible', () => {
      vh.update_(0.1);
      expect(vh.scheduledRunId_).to.be.ok;

      // Goes invisible.
      vh.update_(0);
      expect(vh.scheduledRunId_).to.be.null;
      clock.tick(1000);
      expect(updateStub).to.not.be.called;
    });

    it('conditions met', () => {
      vh.update_(0.1);
      expect(vh.scheduledRunId_).to.be.ok;

      // Goes invisible.
      vh.continuousTime_ = vh.totalVisibleTime_ = 10;
      vh.update_(1);
      expect(vh.scheduledRunId_).to.be.null;
      expect(eventSpy).to.be.calledOnce;
      clock.tick(1000);
      expect(updateStub).to.not.be.called;
    });
  });


  describe('tracking math', () => {

    it('should register "seen" values', () => {
      const vh = new VisibilityModel(NO_SPEC, NO_CALC);

      // Not yet visible: nothing is registered.
      vh.updateCounters_(0);
      expect(vh.getState(startTime)).to.contains({
        firstSeenTime: 0,
        lastSeenTime: 0,
        loadTimeVisibility: 0,
      });

      // First-time visible: values updated.
      clock.tick(100);
      vh.updateCounters_(0.1);
      expect(vh.getState(startTime)).to.contains({
        firstSeenTime: 101,
        lastSeenTime: 101,
        loadTimeVisibility: 10,
      });

      // Repeat visible: most values do not change.
      clock.tick(100);
      vh.updateCounters_(0.2);
      expect(vh.getState(startTime)).to.contains({
        firstSeenTime: 101,
        lastSeenTime: 201,
        loadTimeVisibility: 10,
      });
    });

    it('should ignore "load visibility" after timeout', () => {
      const vh = new VisibilityModel(NO_SPEC, NO_CALC);
      clock.tick(500);
      vh.updateCounters_(0.1);
      expect(vh.getState(startTime)).to.contains({
        firstSeenTime: 501,
        lastSeenTime: 501,
        loadTimeVisibility: 0,
      });
    });

    it('should match default visibility position', () => {
      const vh = new VisibilityModel(NO_SPEC, NO_CALC);
      vh.updateCounters_(0);
      expect(vh.matchesVisibility_).to.be.false;

      vh.updateCounters_(-1);
      expect(vh.matchesVisibility_).to.be.false;

      vh.updateCounters_(0.0001);
      expect(vh.matchesVisibility_).to.be.true;

      vh.updateCounters_(0.9999);
      expect(vh.matchesVisibility_).to.be.true;

      vh.updateCounters_(1);
      expect(vh.matchesVisibility_).to.be.true;

      vh.updateCounters_(1.00001);
      expect(vh.matchesVisibility_).to.be.false;
    });

    it('should match custom visibility position', () => {
      const vh = new VisibilityModel({
        visiblePercentageMin: 10,
        visiblePercentageMax: 90,
      }, NO_CALC);
      vh.updateCounters_(0);
      expect(vh.matchesVisibility_).to.be.false;

      vh.updateCounters_(-1);
      expect(vh.matchesVisibility_).to.be.false;

      vh.updateCounters_(0.1);
      expect(vh.matchesVisibility_).to.be.false;

      vh.updateCounters_(0.1001);
      expect(vh.matchesVisibility_).to.be.true;

      vh.updateCounters_(0.9);
      expect(vh.matchesVisibility_).to.be.true;

      vh.updateCounters_(0.90001);
      expect(vh.matchesVisibility_).to.be.false;

      vh.updateCounters_(1);
      expect(vh.matchesVisibility_).to.be.false;

      vh.updateCounters_(1.00001);
      expect(vh.matchesVisibility_).to.be.false;
    });

    it('should transition to visible and stay visible', () => {
      const vh = new VisibilityModel(NO_SPEC, NO_CALC);
      clock.tick(100);
      vh.updateCounters_(0.1);
      expect(vh.getState(startTime)).to.contains({
        fistVisibleTime: 101,
        lastVisibleTime: 101,
        totalVisibleTime: 0,
        maxContinuousVisibleTime: 0,
        minVisiblePercentage: 10,
        maxVisiblePercentage: 10,
      });
      expect(vh.lastVisibleUpdateTime_).to.equal(Date.now());

      // Stay visible.
      clock.tick(100);
      vh.updateCounters_(0.05);
      expect(vh.getState(startTime)).to.contains({
        fistVisibleTime: 101,  // Doesn't change.
        lastVisibleTime: 201,
        totalVisibleTime: 100,
        maxContinuousVisibleTime: 100,
        minVisiblePercentage: 5,
        maxVisiblePercentage: 10,
      });
      expect(vh.lastVisibleUpdateTime_).to.equal(Date.now());

      // Continue visible.
      clock.tick(100);
      vh.updateCounters_(0.2);
      expect(vh.getState(startTime)).to.contains({
        fistVisibleTime: 101,  // Doesn't change.
        lastVisibleTime: 301,
        totalVisibleTime: 200,
        maxContinuousVisibleTime: 200,
        minVisiblePercentage: 5,
        maxVisiblePercentage: 20,
      });
      expect(vh.lastVisibleUpdateTime_).to.equal(Date.now());
    });

    it('should transition to invisible and back to visible', () => {
      const vh = new VisibilityModel(NO_SPEC, NO_CALC);
      clock.tick(100);
      vh.updateCounters_(0.1);
      expect(vh.getState(startTime)).to.contains({
        fistVisibleTime: 101,
        lastVisibleTime: 101,
        totalVisibleTime: 0,
        maxContinuousVisibleTime: 0,
        minVisiblePercentage: 10,
        maxVisiblePercentage: 10,
      });
      expect(vh.lastVisibleUpdateTime_).to.equal(Date.now());

      // Stay visible.
      clock.tick(100);
      vh.updateCounters_(0.05);
      expect(vh.getState(startTime)).to.contains({
        fistVisibleTime: 101,  // Doesn't change.
        lastVisibleTime: 201,
        totalVisibleTime: 100,
        maxContinuousVisibleTime: 100,
        minVisiblePercentage: 5,
        maxVisiblePercentage: 10,
      });
      expect(vh.lastVisibleUpdateTime_).to.equal(Date.now());

      // Go invisible.
      clock.tick(100);
      vh.updateCounters_(0);
      expect(vh.getState(startTime)).to.contains({
        // Last update.
        totalVisibleTime: 200,
        maxContinuousVisibleTime: 200,
        lastVisibleTime: 301,
        // No changes.
        fistVisibleTime: 101,
        minVisiblePercentage: 5,
        maxVisiblePercentage: 10,
      });
      expect(vh.lastVisibleUpdateTime_).to.equal(0);

      // Stay invisible.
      clock.tick(100);
      vh.updateCounters_(0);
      expect(vh.getState(startTime)).to.contains({
        // No changes.
        totalVisibleTime: 200,
        maxContinuousVisibleTime: 200,
        lastVisibleTime: 301,
        fistVisibleTime: 101,
        minVisiblePercentage: 5,
        maxVisiblePercentage: 10,
      });
      expect(vh.lastVisibleUpdateTime_).to.equal(0);

      // Back to visible.
      clock.tick(100);
      vh.updateCounters_(0.6);
      expect(vh.getState(startTime)).to.contains({
        maxVisiblePercentage: 60,
        lastVisibleTime: 501,
        // No changes.
        totalVisibleTime: 200,
        maxContinuousVisibleTime: 200,
        fistVisibleTime: 101,
        minVisiblePercentage: 5,
      });
      expect(vh.lastVisibleUpdateTime_).to.equal(Date.now());

      // Stay to visible.
      clock.tick(100);
      vh.updateCounters_(0.7);
      expect(vh.getState(startTime)).to.contains({
        maxVisiblePercentage: 70,
        lastVisibleTime: 601,
        totalVisibleTime: 300,
        // No changes.
        maxContinuousVisibleTime: 200,
        fistVisibleTime: 101,
        minVisiblePercentage: 5,
      });
      expect(vh.lastVisibleUpdateTime_).to.equal(Date.now());
    });

    it('should yield based on position only', () => {
      const vh = new VisibilityModel({
        visiblePercentageMin: 10,
        visiblePercentageMax: 90,
      }, NO_CALC);
      clock.tick(100);
      expect(vh.updateCounters_(0)).to.be.false;
      expect(vh.updateCounters_(0.1)).to.be.false;
      expect(vh.updateCounters_(0.9001)).to.be.false;
      expect(vh.updateCounters_(0.1001)).to.be.true;
      expect(vh.updateCounters_(0.9)).to.be.true;
    });

    it('should yield based on total time only', () => {
      const vh = new VisibilityModel({
        totalTimeMin: 10,
        totalTimeMax: 90,
      }, NO_CALC);
      expect(vh.updateCounters_(0.1)).to.be.false;
      clock.tick(5);
      expect(vh.updateCounters_(0)).to.be.false;
      clock.tick(100);
      expect(vh.updateCounters_(0.1)).to.be.false;
      clock.tick(5);
      expect(vh.updateCounters_(0.1)).to.be.true;
      clock.tick(90);
      expect(vh.updateCounters_(0.1)).to.be.false;
    });

    it('should yield based on continuous time only', () => {
      const vh = new VisibilityModel({
        continuousTimeMin: 10,
        continuousTimeMax: 90,
      }, NO_CALC);
      expect(vh.updateCounters_(0.1)).to.be.false;
      clock.tick(5);
      expect(vh.updateCounters_(0)).to.be.false;
      clock.tick(100);
      expect(vh.updateCounters_(0.1)).to.be.false;
      clock.tick(5);
      expect(vh.updateCounters_(0.1)).to.be.false;
      clock.tick(5);
      expect(vh.updateCounters_(0.1)).to.be.true;
      clock.tick(90);
      expect(vh.updateCounters_(0.1)).to.be.false;
    });
  });


  describe('end-to-end events', () => {
    let visibility;
    let calcVisibility;

    beforeEach(() => {
      visibility = 0;
      calcVisibility = () => visibility;
    });

    it('should trigger for visibility percent only', () => {
      const vh = new VisibilityModel({
        visiblePercentageMin: 49,
        visiblePercentageMax: 80,
      }, calcVisibility);
      const eventSpy = vh.eventResolver_ = sandbox.spy();

      visibility = 0.63;
      vh.update();
      expect(vh.getState(startTime)).to.contains({
        minVisiblePercentage: 63,
        maxVisiblePercentage: 63,
        loadTimeVisibility: 63,
      });
      expect(eventSpy).to.be.calledOnce;
    });

    it('should only update load-time visibility once', () => {
      const vh = new VisibilityModel({
        visiblePercentageMin: 49,
        visiblePercentageMax: 80,
      }, calcVisibility);
      const eventSpy = vh.eventResolver_ = sandbox.spy();

      visibility = 0.49;
      vh.update();
      visibility = 0.63;
      vh.update();
      expect(vh.getState(startTime)).to.contains({
        minVisiblePercentage: 63,
        maxVisiblePercentage: 63,
        loadTimeVisibility: 49,
      });
      expect(eventSpy).to.be.calledOnce;
    });

    it('should fire with totalTimeMin condition', () => {
      const vh = new VisibilityModel({
        totalTimeMin: 1000,
      }, calcVisibility);
      const eventSpy = vh.eventResolver_ = sandbox.spy();

      visibility = 0.63;
      vh.update();
      expect(vh.getState(startTime)).to.contains({maxVisiblePercentage: 63});
      expect(eventSpy).to.not.be.called;

      clock.tick(999);
      visibility = 0;
      vh.update();
      expect(vh.getState(startTime)).to.contains({maxVisiblePercentage: 63});
      expect(eventSpy).to.not.be.called;

      clock.tick(1000);
      visibility = 0.64;
      vh.update();
      expect(vh.getState(startTime)).to.contains({maxVisiblePercentage: 64});
      expect(eventSpy).to.not.be.called;

      clock.tick(1);
      expect(vh.getState(startTime)).to.contains({
        maxVisiblePercentage: 64,
        totalVisibleTime: 1000,
      });
      expect(eventSpy).to.be.calledOnce;
    });

    it('should fire with continuousTimeMin condition', () => {
      const vh = new VisibilityModel({
        continuousTimeMin: 1000,
      }, calcVisibility);
      const eventSpy = vh.eventResolver_ = sandbox.spy();

      visibility = 0.63;
      vh.update();
      expect(vh.getState(startTime)).to.contains({maxVisiblePercentage: 63});
      expect(eventSpy).to.not.be.called;

      clock.tick(999);
      visibility = 0;
      vh.update();
      expect(vh.getState(startTime)).to.contains({maxVisiblePercentage: 63});
      expect(eventSpy).to.not.be.called;

      clock.tick(1000);
      visibility = 0.64;
      vh.update();
      expect(vh.getState(startTime)).to.contains({maxVisiblePercentage: 64});
      expect(eventSpy).to.not.be.called;

      clock.tick(1);
      visibility = 0.65;
      vh.update();
      expect(vh.getState(startTime)).to.contains({
        maxVisiblePercentage: 65,
        totalVisibleTime: 1000,
      });
      expect(eventSpy).to.not.be.called;

      clock.tick(999);
      expect(eventSpy).to.be.calledOnce;
      expect(vh.getState(startTime)).to.contains({
        maxVisiblePercentage: 65,
        totalVisibleTime: 1999,
      });
    });

    it('should fire with totalTimeMin and visiblePercentageMin', () => {
      const vh = new VisibilityModel({
        totalTimeMin: 1000,
        visiblePercentageMin: 10,
      }, calcVisibility);
      const eventSpy = vh.eventResolver_ = sandbox.spy();

      visibility = 0.05;
      vh.update();
      expect(vh.getState(startTime)).to.contains({maxVisiblePercentage: 0});
      expect(eventSpy).to.not.be.called;

      clock.tick(1000);
      expect(vh.getState(startTime)).to.contains({maxVisiblePercentage: 0});
      expect(eventSpy).to.not.be.called;

      visibility = 0.11;
      vh.update();
      expect(vh.getState(startTime)).to.contains({maxVisiblePercentage: 11});
      expect(eventSpy).to.not.be.called;

      clock.tick(1000);
      expect(eventSpy).to.be.calledOnce;
      expect(vh.getState(startTime)).to.contains({
        maxVisiblePercentage: 11,
        maxContinuousVisibleTime: 1000,
        totalVisibleTime: 1000,
        firstSeenTime: 1,
        fistVisibleTime: 1001,
        lastSeenTime: 2001,
        lastVisibleTime: 2001,
      });
    });

    it('should fire with continuousTimeMin=1k and totalTimeMin=2k', () => {
      const vh = new VisibilityModel({
        totalTimeMin: 2000,
        continuousTimeMin: 1000,
      }, calcVisibility);
      const eventSpy = vh.eventResolver_ = sandbox.spy();

      visibility = 0.05;
      vh.update();
      expect(vh.getState(startTime)).to.contains({maxVisiblePercentage: 5});
      expect(eventSpy).to.not.be.called;

      clock.tick(1000);
      visibility = 0.1;
      vh.update();
      expect(vh.getState(startTime)).to.contains({maxVisiblePercentage: 10});
      expect(eventSpy).to.not.be.called;

      clock.tick(1000);
      expect(eventSpy).to.be.calledOnce;
      expect(vh.getState(startTime)).to.contains({
        maxVisiblePercentage: 10,
        maxContinuousVisibleTime: 2000,
        totalVisibleTime: 2000,
        firstSeenTime: 1,
        fistVisibleTime: 1,
        lastSeenTime: 2001,
        lastVisibleTime: 2001,
      });
    });

    it('should fire with continuousTimeMin=1k and visPercentageMin=50', () => {
      const vh = new VisibilityModel({
        continuousTimeMin: 1000,
        visiblePercentageMin: 49,
      }, calcVisibility);
      const eventSpy = vh.eventResolver_ = sandbox.spy();

      clock.tick(999);
      visibility = 0;
      vh.update();
      expect(vh.getState(startTime)).to.contains({maxVisiblePercentage: 0});
      expect(eventSpy).to.not.be.called;

      clock.tick(1000);
      visibility = 0.5;
      vh.update();
      expect(vh.getState(startTime)).to.contains({maxVisiblePercentage: 50});
      expect(eventSpy).to.not.be.called;

      clock.tick(999);
      expect(eventSpy).to.not.be.called;

      clock.tick(1);
      expect(eventSpy).to.be.calledOnce;
      expect(vh.getState(startTime)).to.contains({
        maxContinuousVisibleTime: 1000,
        minVisiblePercentage: 50,
        maxVisiblePercentage: 50,
        totalVisibleTime: 1000,
      });
    });
  });
});
