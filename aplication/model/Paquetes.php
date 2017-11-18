<?php
class Paquetes{

	public function getPaquetes()
	{
		$sql   = "SELECT * FROM paquetes";
		$query = new Consulta($sql);
		$datos = array();

		while($row = $query->VerRegistro()){
			$datos[] = array(
				'id' => $row['id_paquete'] ,
				'nombre' => $row['nombre_paquete'],
				'descripcion' => $row['descripcion_paquete']  );
			}
			return $datos;
		}

		static public function getTotalPaquetes()
		{
			$sql   = "SELECT count(*) as total FROM paquetes";
			$query = new Consulta($sql);
			$row = $query->VerRegistro();
			return $row['total'];
		}

		static public function getPaquetesItinerarioDetalle($id)
		{
			$sql   = "SELECT * FROM paquetes_itinerarios_detalles WHERE id_paquete_itinerario= '".$id."' ";
			$query = new Consulta($sql);
			$datos = array();

			while($row = $query->VerRegistro()){
				$datos[] = array(
					'id_servicio' => $row['id_servicio']);
				}
				return $datos;
			}

			public function getHotelesxItinerario($id){
				$sql = "SELECT * FROM paquetes_itinerarios_hoteles WHERE id_paquete_itinerario = '".$id."' " ;
				$query = new Consulta($sql);
				while($row = $query->VerRegistro()){
					$hoteles[] =  $row['id_hotel'];
				}
				return $hoteles;
			}

			public function getInclusiones($id,$tipo){
				$sql = "SELECT * FROM paquetes_inclusiones where id_paquete = '".$id."' and tipo_inclusion = '".$tipo."' " ;
				$query = new Consulta($sql);
				while ($row = $query->VerRegistro()) {
					$inclusiones[] =  $row['nombre_inclusion'];
				}
				return $inclusiones;
			}

			public function getHotelesxDepartamento_2($id){
				$sql = "SELECT * FROM paquetes_destinos where id_paquete = ".$id ;
				$query = new Consulta($sql);
				$count = 1;
				$adicional ="(";
				while ($row = $query->VerRegistro()) {
					if ($count == 1) {
						$adicional .= $row['id_departamento'];
					}else {
						$adicional .= ",".$row['id_departamento'];
					}
					$count++;
				}
				$adicional .=")";
				$sql = "SELECT ht.id_hotel,h.nombre_hotel,ha.id_habitacion,ROUND(ht.precio_nacional/ha.cantidad_habitacion,2) 'precio_nacional_persona',
				ROUND(ht.precio_extranjero/ha.cantidad_habitacion,2) 'precio_extranjero_persona',ha.nombre_habitacion
				FROM hoteles_tarifas ht inner join habitaciones ha using(id_habitacion) inner join hoteles h using(id_hotel)
				where id_habitacion IN (1,2,3) and id_hotel
				IN (select id_hotel from hoteles where id_departamento IN ".$adicional.") order by id_hotel,ha.id_habitacion;";
				$resultado = new Consulta($sql);
				while ($row = $resultado->VerRegistro()) {
					$datos[] = array(
						'id_hotel' => $row['id_hotel'],
						'nombre_hotel' => $row['nombre_hotel'],
						'id_habitacion' => $row['id_habitacion'],
						'precio_nacional_persona' => $row['precio_nacional_persona'],
						'precio_extranjero_persona' => $row['precio_extranjero_persona'],
						'nombre_habitacion' => $row['nombre_habitacion']
					);
				}
				return $datos;
			}

		}
	?>
