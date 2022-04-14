import { isArray, contains } from 'underscore';

export default {
  run(ed, s, opts = {}) {
    const em = ed.getModel();
    const clp = em.get('clipboard');
    const selected = ed.getSelected();

    if (clp && selected) {
      ed.getSelectedAll().forEach(comp => {
        if (!comp) return;

        const coll = comp.collection;
        if (!coll) return;

        let added;
        const at = coll.indexOf(comp) + 1;
        const addOpts = { at, action: opts.action || 'paste-component' };
        const copyable = clp.filter(cop => cop.get('copyable'));
        const pasteable = copyable.filter(cop => ed.Components.canMove(comp.parent(), cop).result);

        if (contains(clp, comp) && comp.get('copyable')) {
          added = coll.add(comp.clone(), addOpts);
        } else {
          added = coll.add(
            pasteable.map(cop => cop.clone()),
            addOpts
          );
        }

        added = isArray(added) ? added : [added];
        added.forEach(add => ed.trigger('component:paste', add));
      });

      selected.emitUpdate();
    }
  },
};
