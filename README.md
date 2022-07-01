# pacman-cockroachdb
## To install and run demo
1. Deploy a ROSA cluster on AWS
2. Install the RHODA operator from https://console.redhat.com
3. Create a Cockroach Serverless or Dedicated instance at https://www.cockroachlabs.com/get-started-cockroachdb/
4. Import the above database provider account into RHODA by following by following [this](https://access.redhat.com/documentation/en-us/red_hat_openshift_database_access/1/html-single/quick_start_guide/index#find-your-cockroachdb-account-credentials_rhoda-qsg) guide.
5. Create an OpenShift project and create a running Pacman (NodeJS) pod using this repository.
6. Add the RHODA DBaaS Connection into the project and create a Service Binding to the running pod. 
7. Use the route to the Pacman pod and open the game using a web browser. 
