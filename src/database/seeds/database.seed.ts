import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Drone } from '../../modules/drones/entities/drone.entity';
import { Medication } from '../../modules/medications/entities/medication.entity';
import { Admin } from '../../modules/admin/entities/admin.entity';
import * as bcrypt from 'bcrypt';
import {
  UserRole,
  UserType,
  DroneModel,
  DroneStatus,
  MedicationType,
} from '../../shared';

export class DatabaseSeed {
  constructor(private dataSource: DataSource) {}

  async seed() {
    console.log('🚀 Starting database seeding...');

    await this.seedAdmins();
    await this.seedUsers();
    await this.seedDrones();
    await this.seedMedications();

    console.log('✅ Database seeding completed successfully!');
  }

  private async seedAdmins() {
    const adminRepository = this.dataSource.getRepository(Admin);

    const existingAdmins = await adminRepository.find();
    if (existingAdmins.length === 0) {
      const admins = [
        {
          firstName: 'Super',
          lastName: 'Admin',
          email: 'super.admin@drone-logistics.com',
          password: await bcrypt.hash('SuperAdmin123!', 10),
          role: UserRole.ADMIN,
          isActive: true,
        },
        {
          firstName: 'System',
          lastName: 'Manager',
          email: 'system.manager@drone-logistics.com',
          password: await bcrypt.hash('SystemManager123!', 10),
          role: UserRole.ADMIN,
          isActive: true,
        },
        {
          firstName: 'Fleet',
          lastName: 'Controller',
          email: 'fleet.controller@drone-logistics.com',
          password: await bcrypt.hash('FleetController123!', 10),
          role: UserRole.ADMIN,
          isActive: true,
        },
        {
          firstName: 'Operations',
          lastName: 'Director',
          email: 'operations.director@drone-logistics.com',
          password: await bcrypt.hash('Operations123!', 10),
          role: UserRole.ADMIN,
          isActive: true,
        },
        {
          firstName: 'Technical',
          lastName: 'Lead',
          email: 'technical.lead@drone-logistics.com',
          password: await bcrypt.hash('TechnicalLead123!', 10),
          role: UserRole.ADMIN,
          isActive: true,
        },
        {
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@drone-logistics.com',
          password: await bcrypt.hash('SarahJohnson123!', 10),
          role: UserRole.STAFF,
          isActive: true,
        },
        {
          firstName: 'Michael',
          lastName: 'Chen',
          email: 'michael.chen@drone-logistics.com',
          password: await bcrypt.hash('MichaelChen123!', 10),
          role: UserRole.STAFF,
          isActive: true,
        },
        {
          firstName: 'Emily',
          lastName: 'Rodriguez',
          email: 'emily.rodriguez@drone-logistics.com',
          password: await bcrypt.hash('EmilyRodriguez123!', 10),
          role: UserRole.STAFF,
          isActive: true,
        },
        {
          firstName: 'David',
          lastName: 'Wilson',
          email: 'david.wilson@drone-logistics.com',
          password: await bcrypt.hash('DavidWilson123!', 10),
          role: UserRole.STAFF,
          isActive: true,
        },
        {
          firstName: 'Lisa',
          lastName: 'Thompson',
          email: 'lisa.thompson@drone-logistics.com',
          password: await bcrypt.hash('LisaThompson123!', 10),
          role: UserRole.STAFF,
          isActive: true,
        },
      ];

      await adminRepository.save(admins);
      console.log('✅ 10 Admins seeded successfully');
    } else {
      console.log('ℹ️  Admins already exist, skipping seeding');
    }
  }

  private async seedUsers() {
    const userRepository = this.dataSource.getRepository(User);

    const existingUsers = await userRepository.find();
    if (existingUsers.length === 0) {
      const users = [
        {
          firstName: 'John',
          lastName: 'Medic',
          email: 'john.medic@cityhospital.com',
          password: await bcrypt.hash('JohnMedic123!', 10),
          phoneNumber: '+1234567890',
          organizationName: 'City General Hospital',
          address: '123 Medical Center Drive, Healthcare City',
          latitude: 40.7128,
          longitude: -74.006,
          role: UserRole.USER,
          userType: UserType.HOSPITAL,
          isVerified: true,
          isActive: true,
        },
        {
          firstName: 'Maria',
          lastName: 'Pharma',
          email: 'maria.pharma@quickpharmacy.com',
          password: await bcrypt.hash('MariaPharma123!', 10),
          phoneNumber: '+1234567891',
          organizationName: 'Quick Pharmacy Chain',
          address: '456 Drugstore Avenue, Medtown',
          latitude: 40.7589,
          longitude: -73.9851,
          role: UserRole.USER,
          userType: UserType.PHARMACY,
          isVerified: true,
          isActive: true,
        },
        {
          firstName: 'Dr. James',
          lastName: 'Carewell',
          email: 'james.carewell@communityclinic.com',
          password: await bcrypt.hash('JamesCarewell123!', 10),
          phoneNumber: '+1234567892',
          organizationName: 'Community Health Clinic',
          address: '789 Wellness Street, Careville',
          latitude: 40.7505,
          longitude: -73.9934,
          role: UserRole.USER,
          userType: UserType.MEDICAL_CENTER,
          isVerified: true,
          isActive: true,
        },
        {
          firstName: 'Robert',
          lastName: 'Individual',
          email: 'robert.individual@email.com',
          password: await bcrypt.hash('RobertIndividual123!', 10),
          phoneNumber: '+1234567893',
          address: '321 Personal Residence Lane, Hometown',
          latitude: 40.7831,
          longitude: -73.9712,
          role: UserRole.USER,
          userType: UserType.INDIVIDUAL,
          isVerified: true,
          isActive: true,
        },
        {
          firstName: 'Sarah',
          lastName: 'Hospitality',
          email: 'sarah.hospitality@medcorp.com',
          password: await bcrypt.hash('SarahHospitality123!', 10),
          phoneNumber: '+1234567894',
          organizationName: 'MedCorp Healthcare',
          address: '654 Hospital Road, Treatment City',
          latitude: 40.7614,
          longitude: -73.9776,
          role: UserRole.USER,
          userType: UserType.HOSPITAL,
          isVerified: true,
          isActive: true,
        },
        {
          firstName: 'Mike',
          lastName: 'Drugmart',
          email: 'mike.drugmart@pharmachain.com',
          password: await bcrypt.hash('MikeDrugmart123!', 10),
          phoneNumber: '+1234567895',
          organizationName: 'PharmaChain Express',
          address: '987 Pharmacy Plaza, Pillville',
          latitude: 40.7685,
          longitude: -73.9627,
          role: UserRole.USER,
          userType: UserType.PHARMACY,
          isVerified: true,
          isActive: true,
        },
        {
          firstName: 'Dr. Emily',
          lastName: 'Wellness',
          email: 'emily.wellness@urgentcare.com',
          password: await bcrypt.hash('EmilyWellness123!', 10),
          phoneNumber: '+1234567896',
          organizationName: 'Urgent Care Plus',
          address: '147 Emergency Lane, Quickcare City',
          latitude: 40.7794,
          longitude: -73.9558,
          role: UserRole.USER,
          userType: UserType.MEDICAL_CENTER,
          isVerified: true,
          isActive: true,
        },
        {
          firstName: 'Thomas',
          lastName: 'Patient',
          email: 'thomas.patient@personal.com',
          password: await bcrypt.hash('ThomasPatient123!', 10),
          phoneNumber: '+1234567897',
          address: '258 Home Street, Residential Area',
          latitude: 40.7913,
          longitude: -73.9442,
          role: UserRole.USER,
          userType: UserType.INDIVIDUAL,
          isVerified: true,
          isActive: true,
        },
        {
          firstName: 'Jennifer',
          lastName: 'Medical',
          email: 'jennifer.medical@regionalhospital.com',
          password: await bcrypt.hash('JenniferMedical123!', 10),
          phoneNumber: '+1234567898',
          organizationName: 'Regional Medical Center',
          address: '369 Health Boulevard, Treatment Town',
          latitude: 40.7032,
          longitude: -74.017,
          role: UserRole.USER,
          userType: UserType.HOSPITAL,
          isVerified: true,
          isActive: true,
        },
        {
          firstName: 'Alex',
          lastName: 'Pharmcare',
          email: 'alex.pharmcare@neighborhoodpharmacy.com',
          password: await bcrypt.hash('AlexPharmcare123!', 10),
          phoneNumber: '+1234567899',
          organizationName: 'Neighborhood Pharmacy',
          address: '741 Local Street, Communityville',
          latitude: 40.7183,
          longitude: -74.0088,
          role: UserRole.USER,
          userType: UserType.PHARMACY,
          isVerified: true,
          isActive: true,
        },
      ];

      await userRepository.save(users);
      console.log('✅ 10 Users seeded successfully');
    } else {
      console.log('ℹ️  Users already exist, skipping seeding');
    }
  }

  private async seedDrones() {
    const droneRepository = this.dataSource.getRepository(Drone);

    const existingDrones = await droneRepository.find();
    if (existingDrones.length === 0) {
      const baseLat = 40.7128;
      const baseLng = -74.006;

      const drones = [
        {
          serialNumber: 'DRN-LW-001',
          model: DroneModel.LIGHTWEIGHT,
          weightLimit: 100,
          batteryCapacity: 100,
          status: DroneStatus.IDLE,
          baseLatitude: baseLat,
          baseLongitude: baseLng,
          currentLatitude: baseLat,
          currentLongitude: baseLng,
          currentLoadWeight: 0,
          isActive: true,
          lastMaintenanceDate: new Date('2024-01-15'),
          totalFlightTime: 120,
        },
        {
          serialNumber: 'DRN-MW-002',
          model: DroneModel.MIDDLEWEIGHT,
          weightLimit: 250,
          batteryCapacity: 95,
          status: DroneStatus.LOADING,
          baseLatitude: baseLat,
          baseLongitude: baseLng,
          currentLatitude: baseLat,
          currentLongitude: baseLng,
          currentLoadWeight: 150,
          isActive: true,
          lastMaintenanceDate: new Date('2024-01-10'),
          totalFlightTime: 300,
        },
        {
          serialNumber: 'DRN-CW-003',
          model: DroneModel.CRUISERWEIGHT,
          weightLimit: 350,
          batteryCapacity: 80,
          status: DroneStatus.LOADED,
          baseLatitude: baseLat,
          baseLongitude: baseLng,
          currentLatitude: baseLat,
          currentLongitude: baseLng,
          currentLoadWeight: 300,
          isActive: true,
          lastMaintenanceDate: new Date('2024-01-05'),
          totalFlightTime: 450,
        },
        {
          serialNumber: 'DRN-HW-004',
          model: DroneModel.HEAVYWEIGHT,
          weightLimit: 500,
          batteryCapacity: 100,
          status: DroneStatus.DELIVERING,
          baseLatitude: baseLat,
          baseLongitude: baseLng,
          currentLatitude: 40.7589,
          currentLongitude: -73.9851,
          currentLoadWeight: 450,
          isActive: true,
          lastMaintenanceDate: new Date('2024-01-20'),
          totalFlightTime: 200,
        },
        {
          serialNumber: 'DRN-LW-005',
          model: DroneModel.LIGHTWEIGHT,
          weightLimit: 100,
          batteryCapacity: 65,
          status: DroneStatus.DELIVERED,
          baseLatitude: baseLat,
          baseLongitude: baseLng,
          currentLatitude: 40.7505,
          currentLongitude: -73.9934,
          currentLoadWeight: 0,
          isActive: true,
          lastMaintenanceDate: new Date('2024-01-18'),
          totalFlightTime: 180,
        },
        {
          serialNumber: 'DRN-MW-006',
          model: DroneModel.MIDDLEWEIGHT,
          weightLimit: 250,
          batteryCapacity: 40,
          status: DroneStatus.RETURNING,
          baseLatitude: baseLat,
          baseLongitude: baseLng,
          currentLatitude: 40.7614,
          currentLongitude: -73.9776,
          currentLoadWeight: 0,
          isActive: true,
          lastMaintenanceDate: new Date('2024-01-12'),
          totalFlightTime: 320,
        },
        {
          serialNumber: 'DRN-CW-007',
          model: DroneModel.CRUISERWEIGHT,
          weightLimit: 350,
          batteryCapacity: 25,
          status: DroneStatus.MAINTENANCE,
          baseLatitude: baseLat,
          baseLongitude: baseLng,
          currentLatitude: baseLat,
          currentLongitude: baseLng,
          currentLoadWeight: 0,
          isActive: false,
          lastMaintenanceDate: new Date('2024-01-25'),
          totalFlightTime: 500,
        },
        {
          serialNumber: 'DRN-HW-008',
          model: DroneModel.HEAVYWEIGHT,
          weightLimit: 500,
          batteryCapacity: 90,
          status: DroneStatus.IDLE,
          baseLatitude: baseLat,
          baseLongitude: baseLng,
          currentLatitude: baseLat,
          currentLongitude: baseLng,
          currentLoadWeight: 0,
          isActive: true,
          lastMaintenanceDate: new Date('2024-01-08'),
          totalFlightTime: 150,
        },
        {
          serialNumber: 'DRN-LW-009',
          model: DroneModel.LIGHTWEIGHT,
          weightLimit: 100,
          batteryCapacity: 75,
          status: DroneStatus.LOADING,
          baseLatitude: baseLat,
          baseLongitude: baseLng,
          currentLatitude: baseLat,
          currentLongitude: baseLng,
          currentLoadWeight: 50,
          isActive: true,
          lastMaintenanceDate: new Date('2024-01-22'),
          totalFlightTime: 90,
        },
        {
          serialNumber: 'DRN-MW-010',
          model: DroneModel.MIDDLEWEIGHT,
          weightLimit: 250,
          batteryCapacity: 85,
          status: DroneStatus.IDLE,
          baseLatitude: baseLat,
          baseLongitude: baseLng,
          currentLatitude: baseLat,
          currentLongitude: baseLng,
          currentLoadWeight: 0,
          isActive: true,
          lastMaintenanceDate: new Date('2024-01-14'),
          totalFlightTime: 270,
        },
      ];

      await droneRepository.save(drones);
      console.log('✅ 10 Drones seeded successfully');
    } else {
      console.log('ℹ️  Drones already exist, skipping seeding');
    }
  }

  private async seedMedications() {
    const medicationRepository = this.dataSource.getRepository(Medication);

    const existingMedications = await medicationRepository.find();
    if (existingMedications.length === 0) {
      const medications = [
        {
          name: 'Aspirin 100mg Tablets',
          code: 'ASP-100-001',
          weight: 50,
          imageUrl: 'https://example.com/images/aspirin.jpg',
          type: MedicationType.MEDICATION,
          description: 'Pain reliever and anti-inflammatory medication',
          isActive: true,
        },
        {
          name: 'Amoxicillin 500mg Capsules',
          code: 'AMX-500-001',
          weight: 100,
          imageUrl: 'https://example.com/images/amoxicillin.jpg',
          type: MedicationType.MEDICATION,
          description: 'Broad-spectrum antibiotic for bacterial infections',
          isActive: true,
        },
        {
          name: 'Insulin Vials - Fast Acting',
          code: 'INS-FA-001',
          weight: 150,
          imageUrl: 'https://example.com/images/insulin.jpg',
          type: MedicationType.MEDICATION,
          description: 'Fast-acting insulin for diabetes management',
          isActive: true,
        },
        {
          name: 'Blood Pressure Monitor',
          code: 'BPM-DGT-001',
          weight: 400,
          imageUrl: 'https://example.com/images/bp-monitor.jpg',
          type: MedicationType.MEDICAL_EQUIPMENT,
          description: 'Digital blood pressure monitoring device',
          isActive: true,
        },
        {
          name: 'Emergency First Aid Kit',
          code: 'FAK-EMG-001',
          weight: 800,
          imageUrl: 'https://example.com/images/first-aid-kit.jpg',
          type: MedicationType.MEDICAL_SUPPLIES,
          description: 'Comprehensive emergency first aid supplies',
          isActive: true,
        },
        {
          name: 'COVID-19 Rapid Test Kit',
          code: 'CV19-RT-001',
          weight: 75,
          imageUrl: 'https://example.com/images/covid-test.jpg',
          type: MedicationType.TEST_KIT,
          description: 'Rapid antigen test for COVID-19 detection',
          isActive: true,
        },
        {
          name: 'Vitamin C 1000mg Tablets',
          code: 'VIT-C-1000-001',
          weight: 120,
          imageUrl: 'https://example.com/images/vitamin-c.jpg',
          type: MedicationType.SUPPLEMENT,
          description: 'High-potency Vitamin C immune support',
          isActive: true,
        },
        {
          name: 'Portable Oxygen Concentrator',
          code: 'OXY-CON-001',
          weight: 2000,
          imageUrl: 'https://example.com/images/oxygen-concentrator.jpg',
          type: MedicationType.MEDICAL_EQUIPMENT,
          description: 'Portable medical oxygen delivery system',
          isActive: true,
        },
        {
          name: 'Diabetes Test Strips',
          code: 'DIA-STRP-001',
          weight: 30,
          imageUrl: 'https://example.com/images/test-strips.jpg',
          type: MedicationType.MEDICAL_SUPPLIES,
          description: 'Blood glucose monitoring test strips',
          isActive: true,
        },
        {
          name: 'Antiseptic Wound Spray',
          code: 'ANT-SEP-001',
          weight: 200,
          imageUrl: 'https://example.com/images/antiseptic-spray.jpg',
          type: MedicationType.MEDICATION,
          description: 'Topical antiseptic for wound cleaning and prevention',
          isActive: true,
        },
      ];

      await medicationRepository.save(medications);
      console.log('✅ 10 Medications seeded successfully');
    } else {
      console.log('ℹ️  Medications already exist, skipping seeding');
    }
  }
}
