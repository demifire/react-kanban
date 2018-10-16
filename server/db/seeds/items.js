exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('items').del()
    .then(function () {
      // Inserts seed entries
      return knex('items').insert([
        {task: 'A Mana Potion',     
        priority: 'Low',
        description: 'Assigned by Jon',
        type: 'Todo',
        sortingid: 1},
        {task: 'Staff of Light',     
        priority: 'Low',
        description: 'Assigned by Jon',
        type: 'Doing',
        sortingid: 2},
        {task: 'Shroud of the Pantheon',     
        priority: 'Low',
        description: 'Assigned by Jon',
        type: 'Done',
        sortingid: 3}
      ]);
    });
};