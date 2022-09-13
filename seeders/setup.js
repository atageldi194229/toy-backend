const { sequelize } = require("../models");

(async () => {
  // delete all tables then create again, restart db
  await sequelize.drop({ force: true });
  await sequelize.sync({ force: true });

  // end process
  console.log("Setup done.");
  process.exit();
})();
