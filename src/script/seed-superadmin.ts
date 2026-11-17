import { dataSourceOptions } from '@/config/.';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as argon2 from 'argon2';
import { User } from '@/modules/user/entities/user.entity';
import { UserProfile } from '@/modules/user/entities/user-profile.entity';
import { Role } from '@/common/enums/role.enum';
import { AccountStatus } from '@/common/enums/account-status.enum';

async function seedSuperAdmin() {
  const email = process.argv[2] || process.env.SUPER_ADMIN_EMAIL || 'superadmin@gmail.com';
  const password = process.argv[3] || process.env.SUPER_ADMIN_PASSWORD || 'Superadmin@123';
  const fullName = process.argv[4] || 'SuperAdmin';

  console.log(`Connecting to database to seed Super Admin (${email})...`);

  const ds = new DataSource({
    ...dataSourceOptions,
  } as PostgresConnectionOptions);

  const connection = await ds.initialize();
  const userRepo = connection.getRepository(User);
  const profileRepo = connection.getRepository(UserProfile);

  let user = await userRepo.findOne({ where: { email } });

  if (user) {
    user.role = Role.SUPER_ADMIN;
    user.accountStatus = AccountStatus.ACTIVE;
    await userRepo.save(user);
    console.log(`✅ Existing user found. Promoted to ${Role.SUPER_ADMIN} successfully!`);
  } else {
    const passwordHash = await argon2.hash(password);
    user = userRepo.create({
      fullName,
      email,
      passwordHash,
      accountStatus: AccountStatus.ACTIVE,
      role: Role.SUPER_ADMIN,
      profile: profileRepo.create(),
    });
    await userRepo.save(user);
    console.log(`✅ New Super Admin created successfully!`);
  }

  console.log('----------------------------------------------------');
  console.log(`Email:    ${email}`);
  console.log(`Role:     ${user.role}`);
  console.log(`Status:   ${user.accountStatus}`);
  console.log('----------------------------------------------------');

  await connection.destroy();
}

seedSuperAdmin().catch((err) => {
  console.error('❌ Error seeding Super Admin:', err);
  process.exit(1);
});
