import Role from '../models/roles.js'

async function seedRoles() {
    const roles = ["user", "admin", "superadmin"];
    for (let r of roles) {
        await Role.updateOne({ name: r }, { name: r }, { upsert: true });
    }
    console.log("✅ Roles seeded");
}

export default seedRoles;