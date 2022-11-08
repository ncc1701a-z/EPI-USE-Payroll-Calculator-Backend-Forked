import * as commands from "./commands.js";
export class Factory {
   constructor(factory) {
      factory ? this.map = factory.map : this.map = new Map();
   }

   add(name, command) {
      this.map.set(name, command);
   }

   remove(key) {
      this.map.delete(key);
   }

   create(head, command) {
      return new (this.map.get(head))(...command);
   }
}

export async function loadPlan(planJson, entry) {
   let promises = [];
   let results = [];

   if (!planJson.Plans) {
      throw new Error('Structure is wrong')
   }

   const factory = commands.addCommands();

   function buildCommand(head, command, results = [], promises = []) {
      const obj = factory.create(head, command);
      promises.push(obj.asyncInit());
      results.push(obj);

      return [results, promises, obj];
   }

   Object.entries(planJson.Plans).forEach(([key, value]) => {
      const plan = buildPlan(value, factory, (obj) => { promises.push(obj.asyncInit()) });
      [results, promises] = buildCommand('SavePlan', [plan, key], results, promises);
   });

   [results, promises] = buildCommand('Perform', [planJson.Entry], results, promises);

   const finalPlan = buildCommand('Plan', [results]).pop();

   await Promise.all(promises);
   return finalPlan;
}

function buildPlan(input, factory, objHook = null) {
   const head = input[0];

   if (Array.isArray(head)) {
      const result = [];

      input.forEach((entry) => {
         result.push(buildPlan(entry, factory, objHook));
      });

      const plan = factory.create('Plan', [result]);

      if (objHook) {
         objHook(plan);
      }

      return plan;
   }

   const params = [];

   input.slice(1).forEach((param) => {
      if (Array.isArray(param)) {
         params.push(buildPlan(param, factory, objHook));
      } else {
         params.push(param);
      }
   });

   const obj = factory.create(head, params);

   if (objHook) {
      objHook(obj);
   }

   return obj;
}