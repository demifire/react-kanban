exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('items').del()
    .then(function () {
      // Inserts seed entries
      return knex('items').insert([
        {task: 'A Mana Potion',     
        id: 1,
        priority: 'Low',
        description: 'Assigned by Jon',
        type: 'Todo'},
        {task: 'Staff of Light',     
        id: 2,
        priority: 'Low',
        description: 'Assigned by Jon',
        type: 'Doing'},
        {task: 'Shroud of the Pantheon',     
        id: 3,
        priority: 'Low',
        description: 'Assigned by Jon',
        type: 'Done'}
      ]);
    });
};