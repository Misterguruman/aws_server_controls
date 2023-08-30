import { EC2Client, DescribeInstancesCommand, StartInstancesCommand, StopInstancesCommand } from '@aws-sdk/client-ec2'

const client = new EC2Client({ region: "us-east-1" })

export async function GetEC2Instances() {
  let command = new DescribeInstancesCommand({});
  let data = await client.send(command);

  if ( !data.Reservations ) return null;
  let instances = []; 

  for (let group of data.Reservations) {
    if ( !group.Instances ) continue;

    for (let instance of group.Instances) {
      if ( !instance.Tags || !instance.State) continue;
      let nameTag = instance.Tags.find((tag) => tag.Key == "Name")

      if ( !nameTag || !nameTag.Value ) continue;

      instances.push( { name: nameTag.Value, instanceID: instance.InstanceId, state: instance.State.Name } )
    }
  }
  console.table(instances)
}

export async function StartEC2Instance(instanceIds: string[]) {
  let command = new StartInstancesCommand({InstanceIds: instanceIds})
  let data = await client.send(command)

  console.log(data)
}

export async function StopEC2Instance(instanceIds: string[]) {
  let command = new StopInstancesCommand({ InstanceIds: instanceIds })
  let data = await client.send(command)

  console.log(data)
}


