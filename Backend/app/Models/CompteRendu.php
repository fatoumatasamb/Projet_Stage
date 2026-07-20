<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompteRendu extends Model
{
    use HasFactory;

    protected $table = 'comptes_rendus';

    protected $fillable = ['etudiant_id', 'tp_id', 'fichier', 'date_depot', 'note', 'statut'];

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class);
    }

    public function tp()
    {
        return $this->belongsTo(Tp::class);
    }
}
