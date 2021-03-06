<?php 
class NavegadorFront{

	var $ruta = array();
	var $inicio = array();
	var $actual = array();

	
	public function __construct(){
		
	}

	function setActual($name,$url){
		$this->actual['name'][$name];
		$this->actual['url'][$url];
	}
	

	function bucleCatTrail($id_cat = 0, $id_prod = 0){

		$rx = 0;
		if($id_prod > 0){
			$producto = new Producto($id_prod);
			$id_cat = $producto->__get("_categoria")->__get("_id");			
		}
			
		for($x = 0; $x < 10; $x++){ 
			if($id_cat > 0 ){
				$sql   = "	SELECT * FROM categorias
								WHERE   id_categoria = '".$id_cat."'";
							
				$query = new Consulta($sql);
				$row   = $query->VerRegistro();

				$id_cat = $row['id_parent'];
				$id	    = $row['id_categoria']; 
				$nombre = $row['nombre_categoria']; 				

				$this->ruta[$rx] = array(
							'id'	=> 	$id,
							'url'	=>	'productos.php?cat='.$id,
							'nombre'=>  $nombre
					);						
			}else{
				break;
			}			
			$rx++;  			

		}
		sort($this->ruta);
		if($id_prod > 0){
			
			$producto = new Producto($id_prod);
			$id_cat   = $producto->__get("_categoria")->__get("_id");			 
			$this->ruta[$rx] = array(
									'id'	=> 	$producto->__get("_id"),		
									'url'	=>	'productos.php?prod='.$producto->__get("_id"),
									'nombre'=>  $producto->__get("_nombre")
								);			
			$rx++;
		}
	}	

	

	function display($id_actual=0){
		if($_GET['q'] == ""){
			if(is_array($this->ruta) && count($this->ruta) > 0){
				$x = 0;?>
				<a href="productos.php">PRODUCTOS</a> >
					<?php			
				for($x=0; $x<count($this->ruta); $x++){ ?>
					
					<?php
					if($id_actual == $this->ruta[$x]['id'] && $x == (count($this->ruta) - 1)){ 					
						echo "<h1 class='titulo-page'>".$this->ruta[$x]['nombre']."</h1>";
					}else{?>
						<a href="<?php echo $this->ruta[$x]['url'] ?>"> <?php echo $this->ruta[$x]['nombre'];?></a> > <?php
					}  			
				}
			}else{
				echo "<h1>PRODUCTOS</h1>"; 
			}
		}else{
			echo "Búsqueda: \"".$_GET['q']."\"";
		}
	}
	
	function dislplayCategoria(){
		return $this->ruta[0]['id'];
	}		
}

?>